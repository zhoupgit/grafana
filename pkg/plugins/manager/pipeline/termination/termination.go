package termination

import (
	"context"

	"github.com/grafana/grafana/pkg/plugins"
	"github.com/grafana/grafana/pkg/plugins/config"
	"github.com/grafana/grafana/pkg/plugins/log"
)

// Terminator is responsible for the Termination stage of the plugin loader pipeline.
type Terminator interface {
	Terminate(ctx context.Context, p *plugins.Plugin) (*plugins.Plugin, error)
}

// TerminateFunc is the function used for the Terminate step of the Termination stage.
type TerminateFunc func(ctx context.Context, p *plugins.Plugin) error

type OnSuccessFunc func(ctx context.Context, p *plugins.Plugin)

type OnErrorFunc func(ctx context.Context, p *plugins.Plugin, err error)

type Terminate struct {
	cfg            *config.PluginManagementCfg
	terminateSteps []TerminateFunc

	onSuccessFunc OnSuccessFunc
	onErrorFunc   OnErrorFunc

	log log.Logger
}

type Opts struct {
	TerminateFuncs []TerminateFunc

	OnSuccessFunc OnSuccessFunc
	OnErrorFunc   OnErrorFunc
}

// New returns a new Termination stage.
func New(cfg *config.PluginManagementCfg, opts Opts) (*Terminate, error) {
	if opts.TerminateFuncs == nil {
		opts.TerminateFuncs = []TerminateFunc{}
	}

	if opts.OnSuccessFunc == nil {
		opts.OnSuccessFunc = func(ctx context.Context, p *plugins.Plugin) {}
	}

	if opts.OnErrorFunc == nil {
		opts.OnErrorFunc = func(ctx context.Context, p *plugins.Plugin, err error) {}
	}

	return &Terminate{
		cfg:            cfg,
		terminateSteps: opts.TerminateFuncs,
		onSuccessFunc:  opts.OnSuccessFunc,
		onErrorFunc:    opts.OnErrorFunc,
		log:            log.New("plugins.termination"),
	}, nil
}

// Terminate will execute the Terminate steps of the Termination stage.
func (t *Terminate) Terminate(ctx context.Context, p *plugins.Plugin) (*plugins.Plugin, error) {
	for _, terminate := range t.terminateSteps {
		if err := terminate(ctx, p); err != nil {
			t.onErrorFunc(ctx, p, err)
			return nil, err
		}
	}
	t.onSuccessFunc(ctx, p)
	return p, nil
}
