package authz

import (
	"context"
	"errors"
	"fmt"

	"github.com/grafana/dskit/services"
	openfgav1 "github.com/openfga/api/proto/openfga/v1"
	"github.com/prometheus/client_golang/prometheus"

	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/infra/tracing"
	"github.com/grafana/grafana/pkg/services/authz/zanzana"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
	"github.com/grafana/grafana/pkg/services/grpcserver"
	"github.com/grafana/grafana/pkg/setting"
)

type Service interface {
	services.NamedService
}

var _ Service = (*Zanzana)(nil)

func ProvideZanzanaService(cfg *setting.Cfg, features featuremgmt.FeatureToggles) (*Zanzana, error) {
	s := &Zanzana{
		cfg:      cfg,
		features: features,
		logger:   log.New("zanzana"),
	}
	// We need to use dskit service for when we are ready to use this as a standalone module
	s.BasicService = services.NewBasicService(s.start, s.running, s.stopping).WithName("zanzana")

	return s, nil
}

type Zanzana struct {
	*services.BasicService

	cfg *setting.Cfg

	logger   log.Logger
	handle   grpcserver.Provider
	features featuremgmt.FeatureToggles
}

func (z *Zanzana) start(ctx context.Context) error {
	z.logger.Info("Starting zanana")

	srv, err := zanzana.New(zanzana.NewStore())
	if err != nil {
		return fmt.Errorf("failed to start zanana: %w", err)
	}

	tracingCfg, err := tracing.ProvideTracingConfig(z.cfg)
	if err != nil {
		return err
	}
	tracingCfg.ServiceName = "zanzana"

	tracer, err := tracing.ProvideService(tracingCfg)
	if err != nil {
		return err
	}

	// authenticator interceptors.Authenticator
	z.handle, err = grpcserver.ProvideService(z.cfg, z.features, noopAuthenticator{}, tracer, prometheus.DefaultRegisterer)
	if err != nil {
		return fmt.Errorf("failed to create zanzana grpc server: %w", err)
	}

	openfgav1.RegisterOpenFGAServiceServer(z.handle.GetServer(), srv)
	grpcserver.ProvideReflectionService(z.cfg, z.handle)

	return nil
}

func (z *Zanzana) running(ctx context.Context) error {
	z.logger.Info("Running zanana")
	// handle.Run is blocking so we can just run it here
	return z.handle.Run(ctx)
}

func (z *Zanzana) stopping(err error) error {
	if err != nil && !errors.Is(err, context.Canceled) {
		z.logger.Error("Stopping zanzana due to unexpected error", "err", err)
	} else {
		z.logger.Info("Stopping zanana")
	}
	return nil
}

type noopAuthenticator struct{}

// for now don't perform any authentication
func (n noopAuthenticator) Authenticate(ctx context.Context) (context.Context, error) {
	return ctx, nil
}
