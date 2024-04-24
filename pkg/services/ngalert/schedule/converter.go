package schedule

import (
	context "context"
	"errors"
	"fmt"
	"math"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana-plugin-sdk-go/data"
	"github.com/grafana/grafana/pkg/infra/log"
	ngmodels "github.com/grafana/grafana/pkg/services/ngalert/models"
)

var ErrUnableToCalculate = errors.New("unable to calculate result")
var ErrTargetRefNotFound = errors.New("refID given by RecordFrom not found in result frames")

func FramesToMetrics(ctx context.Context, resp *backend.QueryDataResponse, respErr error, rule *ngmodels.AlertRule, now time.Time, logger log.Logger) (*Metrics, error) {
	r, metrics, err := converterPreCheck(resp, respErr, rule, now)
	if err != nil {
		return metrics, err
	}

	frames := r.Frames
	if len(frames) > 1 {
		// TODO: Frames != series, what bizarre expression has to exist for this to even happen?
		logger.Error("Result returned multiple entire frames, expected 1", "actual", len(frames))
		return toSingleMetric(math.NaN(), now, rule), errors.New("result node had multiple frames; expected only one")
	}
	frame := frames[0]

	// TODO: MOST LIKELY many series will present as many fields. Support multi-fields in the future.
	// TODO: for demo purposes, only support 1.
	if len(frame.Fields) > 1 {
		return toSingleMetric(math.NaN(), now, rule), errors.New("result node had multiple fields; multidim not implemented yet")
	}

	result := &Metrics{
		M:     []Metric{},
		OrgID: rule.OrgID,
	}
	for _, field := range frame.Fields {
		val, err := resultValue(field)
		if err != nil {
			return toSingleMetric(math.NaN(), now, rule), fmt.Errorf("failed to parse series: %w", err)
		}
		result.M = append(result.M, Metric{
			Name:      rule.Record,
			Labels:    injectLabels(field.Labels, rule),
			Value:     val,
			Timestamp: now,
		})
	}
	return result, nil
}

func toSingleMetric(val float64, now time.Time, rule *ngmodels.AlertRule) *Metrics {
	return &Metrics{
		M: []Metric{{
			Name:      rule.Record,
			Timestamp: now,
			Value:     val,
			Labels:    injectLabels(map[string]string{}, rule),
		},
		},
		OrgID: rule.OrgID,
	}
}

func converterPreCheck(resp *backend.QueryDataResponse, respErr error, rule *ngmodels.AlertRule, now time.Time) (backend.DataResponse, *Metrics, error) {
	dr := backend.DataResponse{}
	if respErr != nil {
		return dr, toSingleMetric(math.NaN(), now, rule), fmt.Errorf("%w: %s", ErrUnableToCalculate, respErr.Error())
	}

	r, ok := resp.Responses[rule.RecordFrom]
	if !ok {
		return dr, toSingleMetric(math.NaN(), now, rule), ErrTargetRefNotFound
	}

	if r.Error != nil {
		return r, toSingleMetric(math.NaN(), now, rule), fmt.Errorf("%w: %s", ErrUnableToCalculate, r.Error.Error())
	}
	return r, &Metrics{OrgID: rule.OrgID}, nil
}

func resultValue(field *data.Field) (float64, error) {
	if field.Len() == 0 {
		return 0, errors.New("field had no values to record")
	}
	if field.Len() > 1 {
		return 0, errors.New("all series must look like an instant query - one looks like a range query")
	}
	return field.FloatAt(0)
}

func injectLabels(existing map[string]string, rule *ngmodels.AlertRule) map[string]string {
	for k, v := range rule.Labels {
		existing[k] = v
	}
	existing["rule_uid"] = rule.UID
	existing["rule_name"] = rule.Title
	return existing
}
