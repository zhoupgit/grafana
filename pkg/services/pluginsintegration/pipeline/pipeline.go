package pipeline

import (
	"context"

	"github.com/grafana/grafana/pkg/infra/tracing"
	"github.com/grafana/grafana/pkg/plugins"
	"github.com/grafana/grafana/pkg/plugins/auth"
	"github.com/grafana/grafana/pkg/plugins/config"
	"github.com/grafana/grafana/pkg/plugins/envvars"
	"github.com/grafana/grafana/pkg/plugins/manager/loader/angular/angularinspector"
	"github.com/grafana/grafana/pkg/plugins/manager/loader/assetpath"
	"github.com/grafana/grafana/pkg/plugins/manager/loader/finder"
	"github.com/grafana/grafana/pkg/plugins/manager/pipeline/bootstrap"
	"github.com/grafana/grafana/pkg/plugins/manager/pipeline/discovery"
	"github.com/grafana/grafana/pkg/plugins/manager/pipeline/initialization"
	"github.com/grafana/grafana/pkg/plugins/manager/pipeline/termination"
	"github.com/grafana/grafana/pkg/plugins/manager/pipeline/validation"
	"github.com/grafana/grafana/pkg/plugins/manager/process"
	"github.com/grafana/grafana/pkg/plugins/manager/registry"
	"github.com/grafana/grafana/pkg/plugins/manager/signature"
	"github.com/grafana/grafana/pkg/plugins/state"
	"github.com/grafana/grafana/pkg/services/pluginsintegration/pluginerrs"
)

func ProvideDiscoveryStage(cfg *config.PluginManagementCfg, pf finder.Finder, pr registry.Service,
	stateManager state.Manager) *discovery.Discovery {
	return discovery.New(cfg, discovery.Opts{
		FindFunc: pf.Find,
		FindFilterFuncs: []discovery.FindFilterFunc{
			discovery.NewPermittedPluginTypesFilterStep([]plugins.Type{
				plugins.TypeDataSource, plugins.TypeApp, plugins.TypePanel, plugins.TypeSecretsManager,
			}),
			func(ctx context.Context, _ plugins.Class, b []*plugins.FoundBundle) ([]*plugins.FoundBundle, error) {
				return NewDuplicatePluginIDFilterStep(pr).Filter(ctx, b)
			},
			func(_ context.Context, _ plugins.Class, b []*plugins.FoundBundle) ([]*plugins.FoundBundle, error) {
				return NewDisablePluginsStep(cfg).Filter(b)
			},
			func(_ context.Context, c plugins.Class, b []*plugins.FoundBundle) ([]*plugins.FoundBundle, error) {
				return NewAsExternalStep(cfg).Filter(c, b)
			},
		},
		OnSuccessFunc: func(ctx context.Context, class plugins.Class, bundles []*plugins.FoundBundle) {
			for _, b := range bundles {
				stateManager.SetPluginState(state.PluginInfo{
					PluginID: b.Primary.JSONData.ID,
					Version:  b.Primary.JSONData.Info.Version,
				}, state.StatusDiscovered)

				for _, child := range b.Children {
					stateManager.SetPluginState(state.PluginInfo{
						PluginID: child.JSONData.ID,
						Version:  child.JSONData.Info.Version,
					}, state.StatusDiscovered)
				}
			}
		},
		OnErrorFunc: func(ctx context.Context, class plugins.Class, bundles []*plugins.FoundBundle, err error) {
			for _, b := range bundles {
				stateManager.SetPluginState(state.PluginInfo{
					PluginID: b.Primary.JSONData.ID,
					Version:  b.Primary.JSONData.Info.Version,
				}, state.StatusError)

				for _, child := range b.Children {
					stateManager.SetPluginState(state.PluginInfo{
						PluginID: child.JSONData.ID,
						Version:  child.JSONData.Info.Version,
					}, state.StatusError)
				}
			}
		},
	})
}

func ProvideBootstrapStage(cfg *config.PluginManagementCfg, sc plugins.SignatureCalculator, a *assetpath.Service,
	stateManager state.Manager) *bootstrap.Bootstrap {
	return bootstrap.New(cfg, bootstrap.Opts{
		ConstructFunc: bootstrap.DefaultConstructFunc(sc, a),
		DecorateFuncs: bootstrap.DefaultDecorateFuncs(cfg),
		OnSuccessFunc: func(ctx context.Context, ps []*plugins.Plugin) {
			for _, p := range ps {
				stateManager.SetPluginState(state.PluginInfo{
					PluginID: p.ID,
					Version:  p.Info.Version,
				}, state.StatusBootstrapped)
			}
		},
		OnErrorFunc: func(ctx context.Context, bundles []*plugins.FoundBundle, err error) {
			for _, b := range bundles {
				stateManager.SetPluginState(state.PluginInfo{
					PluginID: b.Primary.JSONData.ID,
					Version:  b.Primary.JSONData.Info.Version,
				}, state.StatusError)

				for _, child := range b.Children {
					stateManager.SetPluginState(state.PluginInfo{
						PluginID: child.JSONData.ID,
						Version:  child.JSONData.Info.Version,
					}, state.StatusError)
				}

			}
		},
	})
}

func ProvideValidationStage(cfg *config.PluginManagementCfg, sv signature.Validator, ai angularinspector.Inspector,
	et pluginerrs.SignatureErrorTracker, stateManager state.Manager) *validation.Validate {
	return validation.New(cfg, validation.Opts{
		ValidateFuncs: []validation.ValidateFunc{
			SignatureValidationStep(sv, et),
			validation.ModuleJSValidationStep(),
			validation.AngularDetectionStep(cfg, ai),
		},
		OnSuccessFunc: func(ctx context.Context, ps []*plugins.Plugin) {
			for _, p := range ps {
				stateManager.SetPluginState(state.PluginInfo{
					PluginID: p.ID,
					Version:  p.Info.Version,
				}, state.StatusValidated)
			}
		},
		OnErrorFunc: func(ctx context.Context, p *plugins.Plugin, err error) {
			stateManager.SetPluginState(state.PluginInfo{
				PluginID: p.ID,
				Version:  p.Info.Version,
			}, state.StatusError)
		},
	})
}

func ProvideInitializationStage(cfg *config.PluginManagementCfg, pr registry.Service, bp plugins.BackendFactoryProvider,
	pm process.Manager, externalServiceRegistry auth.ExternalServiceRegistry,
	roleRegistry plugins.RoleRegistry, pluginEnvProvider envvars.Provider, tracer tracing.Tracer,
	stateManager state.Manager) *initialization.Initialize {
	return initialization.New(cfg, initialization.Opts{
		InitializeFuncs: []initialization.InitializeFunc{
			ExternalServiceRegistrationStep(cfg, externalServiceRegistry, tracer),
			initialization.BackendClientInitStep(pluginEnvProvider, bp),
			initialization.PluginRegistrationStep(pr),
			initialization.BackendProcessStartStep(pm),
			RegisterPluginRolesStep(roleRegistry),
			ReportBuildMetrics,
		},
		OnSuccessFunc: func(ctx context.Context, ps []*plugins.Plugin) {
			for _, p := range ps {
				stateManager.SetPluginState(state.PluginInfo{
					PluginID: p.ID,
					Version:  p.Info.Version,
				}, state.StatusInitialized)
			}
		},
		OnErrorFunc: func(ctx context.Context, p *plugins.Plugin, err error) {
			stateManager.SetPluginState(state.PluginInfo{
				PluginID: p.ID,
				Version:  p.Info.Version,
			}, state.StatusError)
		},
	})
}

func ProvideTerminationStage(cfg *config.PluginManagementCfg, pr registry.Service, pm process.Manager,
	stateManager state.Manager) (*termination.Terminate, error) {
	return termination.New(cfg, termination.Opts{
		TerminateFuncs: []termination.TerminateFunc{
			termination.BackendProcessTerminatorStep(pm),
			termination.DeregisterStep(pr),
		},
		OnSuccessFunc: func(ctx context.Context, p *plugins.Plugin) {
			stateManager.SetPluginState(state.PluginInfo{
				PluginID: p.ID,
				Version:  p.Info.Version,
			}, state.StatusUninstalled)
		},
		OnErrorFunc: func(ctx context.Context, p *plugins.Plugin, err error) {
			stateManager.SetPluginState(state.PluginInfo{
				PluginID: p.ID,
				Version:  p.Info.Version,
			}, state.StatusError)
		},
	})
}
