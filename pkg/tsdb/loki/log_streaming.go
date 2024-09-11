package loki

import (
	"context"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
)

const LogStreamPath = "logStream/"

func (s Service) runLogStream(context.Context, *datasourceInfo, *backend.RunStreamRequest, *backend.StreamSender) error {
	// gather query
	// break down into 15m (configurable) intervals
	// query loki
	// handle results
	// gather and send results
	// something like s.sendResponse(ctx, sender, response)
	return nil
}
