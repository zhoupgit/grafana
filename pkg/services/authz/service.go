package authz

import (
	"context"
	"fmt"

	"github.com/grafana/dskit/services"

	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/modules"
	"github.com/grafana/grafana/pkg/registry"
	"github.com/grafana/grafana/pkg/services/authz/zanzana"
	"github.com/grafana/grafana/pkg/services/featuremgmt"
	"github.com/grafana/grafana/pkg/services/grpcserver"
	"github.com/grafana/grafana/pkg/setting"
)

type Service interface {
	services.NamedService
	registry.BackgroundService
	registry.CanBeDisabled
}

var _ Service = (*Zanzana)(nil)

func ProvideService(cfg *setting.Cfg, features featuremgmt.FeatureToggles, grpc grpcserver.Provider) *Zanzana {
	s := &Zanzana{
		grpc:     grpc,
		features: features,
		logger:   log.New("zanzana"),
	}
	s.BasicService = services.NewBasicService(s.start, s.running, nil).WithName(modules.ZanzanaServer)

	return s
}

type Zanzana struct {
	*services.BasicService

	logger   log.Logger
	cfg      *setting.Cfg
	server   *zanzana.Server
	grpc     grpcserver.Provider
	features featuremgmt.FeatureToggles
}

func (z *Zanzana) Run(ctx context.Context) error {
	if err := z.start(ctx); err != nil {
		return err
	}
	return z.running(ctx)
}

// I think we can start in three different statets
// As standalone
// Embeded
// Only client, not sure we need to handle this one here ??
func (z *Zanzana) start(ctx context.Context) error {
	// FIXME: right now we can only start the server if FlagGrpcServer is enabled
	srv, err := zanzana.New(z.grpc, zanzana.NewStore())
	if err != nil {
		return fmt.Errorf("failed to start zanana: %w", err)
	}

	z.logger.Info("Starting zanana")

	z.server = srv
	return nil
}

func (z *Zanzana) running(ctx context.Context) error {
	z.logger.Info("Running zanana")
	select {
	case <-ctx.Done():
		fmt.Println("stopping zanzana")
	}
	return nil
}

func (z *Zanzana) IsDisabled() bool {
	return !z.features.IsEnabledGlobally(featuremgmt.FlagZanzana)
}
