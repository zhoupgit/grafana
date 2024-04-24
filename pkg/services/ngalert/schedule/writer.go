package schedule

import (
	context "context"
	"fmt"
	"time"

	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/m3db/prometheus_remote_client_golang/promremote"
)

// Writer accepts metrics and writes them to a remote_write endpoint
type Writer struct {
	pw promWriter

	log log.Logger
}

// Metric is an internal representation of a metric used for passing between
// Getters and Writers
type Metric struct {
	Name      string
	Labels    map[string]string
	Value     float64
	Timestamp time.Time
}

type Metrics struct {
	M     []Metric
	OrgID int64
}

type promWriter interface {
	WriteTimeSeries(
		ctx context.Context,
		ts promremote.TSList,
		opts promremote.WriteOptions,
	) (promremote.WriteResult, promremote.WriteError)
}

// NewWriter creates a new metric writer that will write metrics using the
// provided promWriter with the basic auth header from user and password.
func NewWriter(pw promWriter) *Writer {
	return &Writer{
		pw:  pw,
		log: log.New("recorded_queries.metric.writer"),
	}
}

// Write writes metrics to the promWriter
func (w *Writer) Write(ctx context.Context, m *Metrics) error {
	if m == nil {
		w.log.Error("unexpected nil metrics passed to write")
		return nil
	}

	ctxLogger := w.log.FromContext(ctx)

	// timer := prometheus.NewTimer(WriteTime)
	// defer timer.ObserveDuration()

	opts := promremote.WriteOptions{
		Headers: map[string]string{"X-Scope-OrgID": fmt.Sprintf("%v", m.OrgID)},
	}
	series := make([]promremote.TimeSeries, 0, len(m.M))
	for _, metric := range m.M {
		series = append(series, promremote.TimeSeries{
			Labels: w.labelsFor(metric),
			Datapoint: promremote.Datapoint{
				Timestamp: metric.Timestamp,
				Value:     metric.Value,
			},
		})
	}

	_, err := w.pw.WriteTimeSeries(ctx, series, opts)
	if err != nil {
		// WriteErrorCount.WithLabelValues(fmt.Sprint(err.StatusCode())).Inc()
		ctxLogger.Error(err.Error())
	}

	return err
}

func (w *Writer) labelsFor(m Metric) []promremote.Label {
	labels := []promremote.Label{
		{Name: "__name__", Value: m.Name},
	}

	for kv, v := range m.Labels {
		labels = append(labels, promremote.Label{
			Name:  kv,
			Value: v,
		})
	}
	return labels
}
