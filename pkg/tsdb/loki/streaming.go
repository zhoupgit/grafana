package loki

import (
	"context"
	"encoding/json"
	"fmt"
	"net/url"
	"os"
	"os/signal"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
	"github.com/grafana/grafana/pkg/tsdb/loki/kinds/dataquery"
)

func (s *Service) SubscribeStream(ctx context.Context, req *backend.SubscribeStreamRequest) (*backend.SubscribeStreamResponse, error) {
	dsInfo, err := s.getDSInfo(ctx, req.PluginContext)
	if err != nil {
		return &backend.SubscribeStreamResponse{
			Status: backend.SubscribeStreamStatusNotFound,
		}, err
	}

	// Expect tail/${key}
	if !strings.HasPrefix(req.Path, "tail/") && !strings.HasPrefix(req.Path, "mtail/") {
		return &backend.SubscribeStreamResponse{
			Status: backend.SubscribeStreamStatusNotFound,
		}, fmt.Errorf("expected tail in channel path")
	}

	query, err := parseQueryModel(req.Data)
	if err != nil {
		return nil, err
	}
	if query.Expr == nil {
		return &backend.SubscribeStreamResponse{
			Status: backend.SubscribeStreamStatusNotFound,
		}, fmt.Errorf("missing expr in channel (subscribe)")
	}

	dsInfo.streamsMu.RLock()
	defer dsInfo.streamsMu.RUnlock()

	cache, ok := dsInfo.streams[req.Path]
	if ok {
		msg, err := backend.NewInitialData(cache.Bytes(data.IncludeAll))
		return &backend.SubscribeStreamResponse{
			Status:      backend.SubscribeStreamStatusOK,
			InitialData: msg,
		}, err
	}

	// nothing yet
	return &backend.SubscribeStreamResponse{
		Status: backend.SubscribeStreamStatusOK,
	}, err
}

// Single instance for each channel (results are shared with all listeners)
func (s *Service) RunStream(ctx context.Context, req *backend.RunStreamRequest, sender *backend.StreamSender) error {
	dsInfo, err := s.getDSInfo(ctx, req.PluginContext)
	if err != nil {
		return err
	}

	query, err := parseQueryModel(req.Data)
	if err != nil {
		return err
	}
	if query.Expr == nil {
		return fmt.Errorf("missing expr in cuannel")
	}

	if strings.HasPrefix(req.Path, "mtail/") {
		return s.streamMetricQuery(ctx, req, sender, dsInfo)
	}

	logger := s.logger.FromContext(ctx)
	count := int64(0)

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	params := url.Values{}
	params.Add("query", *query.Expr)

	wsurl, _ := url.Parse(dsInfo.URL)

	wsurl.Path = "/loki/api/v2alpha/tail"

	if wsurl.Scheme == "https" {
		wsurl.Scheme = "wss"
	} else {
		wsurl.Scheme = "ws"
	}
	wsurl.RawQuery = params.Encode()

	logger.Info("Connecting to websocket", "url", wsurl)
	c, r, err := websocket.DefaultDialer.Dial(wsurl.String(), nil)
	if err != nil {
		logger.Error("Error connecting to websocket", "err", err)
		return fmt.Errorf("error connecting to websocket")
	}

	defer func() {
		dsInfo.streamsMu.Lock()
		delete(dsInfo.streams, req.Path)
		dsInfo.streamsMu.Unlock()
		if r != nil {
			_ = r.Body.Close()
		}
		err = c.Close()
		logger.Error("Closing loki websocket", "err", err)
	}()

	prev := data.FrameJSONCache{}

	// Read all messages
	done := make(chan struct{})
	go func() {
		defer close(done)
		for {
			_, message, err := c.ReadMessage()
			if err != nil {
				logger.Error("Websocket read:", "err", err)
				return
			}

			frame := &data.Frame{}
			err = json.Unmarshal(message, &frame)

			if err == nil && frame != nil {
				next, _ := data.FrameToJSONCache(frame)
				if next.SameSchema(&prev) {
					err = sender.SendBytes(next.Bytes(data.IncludeDataOnly))
				} else {
					err = sender.SendFrame(frame, data.IncludeAll)
				}
				prev = next

				// Cache the initial data
				dsInfo.streamsMu.Lock()
				dsInfo.streams[req.Path] = prev
				dsInfo.streamsMu.Unlock()
			}

			if err != nil {
				logger.Error("Websocket write:", "err", err, "raw", message)
				return
			}
		}
	}()

	ticker := time.NewTicker(time.Second * 60) // .Step)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			logger.Info("Socket done")
			return nil
		case <-ctx.Done():
			logger.Info("Stop streaming (context canceled)")
			return nil
		case t := <-ticker.C:
			count++
			logger.Error("Loki websocket ping?", "time", t, "count", count)
		}
	}
}

func (s *Service) PublishStream(_ context.Context, _ *backend.PublishStreamRequest) (*backend.PublishStreamResponse, error) {
	return &backend.PublishStreamResponse{
		Status: backend.PublishStreamStatusPermissionDenied,
	}, nil
}

// TimeRange represents a time range for a query and is a property of DataQuery.
type TimeRange struct {
	From time.Time `json:"from"`
	To   time.Time `json:"to"`
}

type MetricQueryJSONModel struct {
	dataquery.LokiDataQuery
	Direction           *string   `json:"direction,omitempty"`
	SupportingQueryType *string   `json:"supportingQueryType"`
	TimeRange           TimeRange `json:"timeRange"`
}

func (s *Service) streamMetricQuery(ctx context.Context, req *backend.RunStreamRequest, sender *backend.StreamSender, ds *datasourceInfo) error {
	s.logger.Info("Running metric query", "model", req)

	lokiQuery, err := parseStreamingQuery(req)
	if err != nil {
		return err
	}

	api := newLokiAPI(ds.HTTPClient, ds.URL, s.logger, s.tracer, false)
	responseOpts := ResponseOpts{
		metricDataplane: s.features.IsEnabled(ctx, featuremgmt.FlagLokiMetricDataplane),
		logsDataplane:   s.features.IsEnabled(ctx, featuremgmt.FlagLokiLogsDataplane),
	}
	// cast model.QueryType to dataquery.LokiQueryType

	expr := lokiQuery.Expr
	for i := 50; i > 0; i-- {
		// sleep for 0.5 seconds
		q := lokiQuery
		braceIndex := strings.LastIndex(expr, "}")
		q.Expr = fmt.Sprintf("%s ,__stream_shard__=\"%d\"%s", (expr)[:braceIndex], i, (expr)[braceIndex:])
		res, _ := runQuery(ctx, api, q, responseOpts, s.logger)
		if res == nil || len(res.Frames) == 0 {
			continue
		}

		for _, frame := range res.Frames {
			if err := sender.SendFrame(frame, data.IncludeAll); err != nil {
				return err
			}
		}
		//frame.Fields = append(frame.Fields, data.NewField("value", nil, []float64{float64(i * 10)}))
		//frame.Fields = append(frame.Fields, data.NewField("time", nil, []time.Time{startTime}))
	}
	return nil
}

func parseStreamingQuery(req *backend.RunStreamRequest) (*lokiQuery, error) {
	var model *MetricQueryJSONModel
	err := json.Unmarshal(req.Data, &model)
	if err != nil {
		return nil, err
	}

	start := model.TimeRange.From
	end := model.TimeRange.To

	resolution := int64(1)
	if model.Resolution != nil && (*model.Resolution >= 1 && *model.Resolution <= 5 || *model.Resolution == 10) {
		resolution = *model.Resolution
	}

	interval := time.Millisecond // set this from the frontend directly
	timeRange := end.Sub(start)

	step, err := calculateStep(interval, timeRange, resolution, model.Step)
	if err != nil {
		return nil, err
	}

	queryType, err := parseQueryType(model.QueryType)
	if err != nil {
		return nil, err
	}

	expr := interpolateVariables(depointerizer(model.Expr), interval, timeRange, queryType, step)
	direction, err := parseDirection(model.Direction)
	if err != nil {
		return nil, err
	}

	var maxLines int64
	if model.MaxLines != nil {
		maxLines = *model.MaxLines
	}
	var legendFormat string
	if model.LegendFormat != nil {
		legendFormat = *model.LegendFormat
	}

	supportingQueryType := parseSupportingQueryType(model.SupportingQueryType)
	return &lokiQuery{
		Expr:                expr,
		QueryType:           queryType,
		Direction:           direction,
		Step:                step,
		MaxLines:            int(maxLines),
		LegendFormat:        legendFormat,
		Start:               start,
		End:                 end,
		SupportingQueryType: supportingQueryType,
		// add a RefID here
	}, nil
}
