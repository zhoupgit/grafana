package loki

import (
	"context"
	"encoding/json"
	"sync"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/backend/tracing"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
	"github.com/grafana/grafana/pkg/tsdb/loki/kinds/dataquery"
)

const LogStreamPath = "logStream/"

type LogQuery struct {
	Query     []QueryExpr `json:"query"`
	TimeRange TimeRange   `json:"timeRange"`
}

type QueryExpr struct {
	Expr  string `json:"expr,omitempty"`
	RefID string `json:"refId,omitempty"`
}

type TimeRange struct {
	From json.Number `json:"from"`
	To   json.Number `json:"to"`
}

func (s Service) runLogStream(ctx context.Context, ds *datasourceInfo, req *backend.RunStreamRequest, sender *backend.StreamSender) error {
	_, span := tracing.DefaultTracer().Start(ctx, "datasource.loki.runLogStream")

	defer span.End()

	// gather query
	//todo(shantanu): this should be another ready struct to map here
	var logQuery *LogQuery
	err := json.Unmarshal(req.Data, &logQuery)
	if err != nil {
		return err
	}
	// todo(shantanu): check if Expr is nil

	// break down into 15m (configurable) intervals
	var wg sync.WaitGroup
	fromInt64, err := logQuery.TimeRange.From.Int64()
	if err != nil {
		return err
	}
	toInt64, err := logQuery.TimeRange.To.Int64()
	if err != nil {
		return err
	}
	start := time.Unix(0, fromInt64*int64(time.Millisecond))
	end := time.Unix(0, toInt64*int64(time.Millisecond))

	interval := int64(30 * time.Minute.Seconds())
	numIntervals := int64(end.Unix()-start.Unix()) / interval
	results := make(chan backend.DataResponse, numIntervals)

	if (int64(end.Unix()-start.Unix()))%interval != 0 {
		numIntervals++
	}

	api := newLokiAPI(ds.HTTPClient, ds.URL, s.logger, s.tracer, false)
	for i := int64(0); i < numIntervals; i++ {
		wg.Add(1)
		go func(i int64) {
			defer wg.Done()
			intervalStart := start.Add(time.Duration(30*i) * time.Second)
			intervalEnd := intervalStart.Add(time.Duration(interval))
			if intervalEnd.After(end) {
				intervalEnd = end
			}

			q := &lokiQuery{
				Expr:      logQuery.Query[0].Expr, //todo(shantanu): understand how to do this for all queries
				QueryType: dataquery.LokiQueryTypeRange,
				Start:     intervalStart,
				End:       intervalEnd,
				RefID:     logQuery.Query[0].RefID,
				Direction: DirectionBackward,
			}

			responseOpts := ResponseOpts{
				metricDataplane: isFeatureEnabled(ctx, featuremgmt.FlagLokiMetricDataplane),
				logsDataplane:   isFeatureEnabled(ctx, featuremgmt.FlagLokiLogsDataplane),
			}

			backendReq := &backend.QueryDataRequest{
				PluginContext: req.PluginContext,
			}
			results <- s.ExecuteQuery(ctx, q, backendReq, false, api, responseOpts, s.tracer, s.logger)
		}(i)
	}

	go func() {
		for res := range results {
			s.logger.Debug("Sending log stream response", "response", res)
			// handle response
		}
	}()

	return nil
}
