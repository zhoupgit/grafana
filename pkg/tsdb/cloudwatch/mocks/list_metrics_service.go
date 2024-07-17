package mocks

import (
	"context"

	"github.com/stretchr/testify/mock"

	"github.com/grafana/grafana/pkg/tsdb/cloudwatch/models/resources"
)

type ListMetricsServiceMock struct {
	mock.Mock
}

func (a *ListMetricsServiceMock) GetDimensionKeysByDimensionFilter(ctx context.Context, r resources.DimensionKeysRequest) ([]resources.ResourceResponse[string], error) {
	args := a.Called(r)

	return args.Get(0).([]resources.ResourceResponse[string]), args.Error(1)
}

func (a *ListMetricsServiceMock) GetDimensionValuesByDimensionFilter(ctx context.Context, r resources.DimensionValuesRequest) ([]resources.ResourceResponse[string], error) {
	args := a.Called(r)

	return args.Get(0).([]resources.ResourceResponse[string]), args.Error(1)
}

func (a *ListMetricsServiceMock) GetMetricsByNamespace(ctx context.Context, r resources.MetricsRequest) ([]resources.ResourceResponse[resources.Metric], error) {
	args := a.Called(r)

	return args.Get(0).([]resources.ResourceResponse[resources.Metric]), args.Error(1)
}
