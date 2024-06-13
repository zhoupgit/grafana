package authz

import (
	"context"
	"errors"
	"fmt"

	"github.com/fullstorydev/grpchan/inprocgrpc"
	"github.com/grafana/dskit/services"
	openfgav1 "github.com/openfga/api/proto/openfga/v1"

	"github.com/grafana/grafana/pkg/infra/log"
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

func ProvideService(cfg *setting.Cfg, features featuremgmt.FeatureToggles, grpc grpcserver.Provider) (*Zanzana, error) {
	s := &Zanzana{
		cfg:      cfg,
		grpc:     grpc,
		features: features,
		logger:   log.New("zanzana"),
	}
	// We need to use dskit service for when we are ready to use this as a standalone module
	s.BasicService = services.NewBasicService(s.start, s.running, nil).WithName("zanzana")

	return s, nil
}

type Zanzana struct {
	*services.BasicService

	cfg *setting.Cfg

	logger   log.Logger
	grpc     grpcserver.Provider
	features featuremgmt.FeatureToggles
}

func (z *Zanzana) Run(ctx context.Context) error {
	fmt.Println("RUN")
	if err := z.start(ctx); err != nil {
		return err
	}
	return z.running(ctx)
}

func (z *Zanzana) start(ctx context.Context) error {
	srv, err := zanzana.New(zanzana.NewStore())
	if err != nil {
		return fmt.Errorf("failed to start zanana: %w", err)
	}

	if z.cfg.Zanzana.Mode == setting.ZanzanaModeEmbedded {
		// TODO we need to provide channel for when clients are created
		channel := &inprocgrpc.Channel{}
		openfgav1.RegisterOpenFGAServiceServer(channel, srv)
	} else {
		if z.grpc.IsDisabled() {
			return errors.New("failed to start zanzana: standalone zanana needs to have grpcServer feature flag enabled")
		}
		openfgav1.RegisterOpenFGAServiceServer(z.grpc.GetServer(), srv)
	}

	z.logger.Info("Starting zanana")

	return nil
}

func (z *Zanzana) running(ctx context.Context) error {
	z.logger.Info("Running zanana")
	select {
	case <-ctx.Done():
		z.logger.Info("Stopping zanana")
	}
	return nil
}

func (z *Zanzana) IsDisabled() bool {
	return !z.features.IsEnabledGlobally(featuremgmt.FlagZanzana)
}
