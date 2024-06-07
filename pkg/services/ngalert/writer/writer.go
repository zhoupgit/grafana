package writer

import (
	"context"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/data"
)

type WriterFactory interface {
	GetWriter(ctx context.Context, orgID int64) (Writer, error)
}

type Writer interface {
	Write(ctx context.Context, name string, t time.Time, frames data.Frames, extraLabels map[string]string) error
}

type NoopWriterFactory struct{}

func (f NoopWriterFactory) GetWriter(ctx context.Context, orgID int64) (Writer, error) {
	return NoopWriter{}, nil
}

type NoopWriter struct{}

func (w NoopWriter) Write(ctx context.Context, name string, t time.Time, frames data.Frames, extraLabels map[string]string) error {
	return nil
}
