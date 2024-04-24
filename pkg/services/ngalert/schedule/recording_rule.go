package schedule

import (
	context "context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"time"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	sdk_httpclient "github.com/grafana/grafana-plugin-sdk-go/backend/httpclient"
	"github.com/grafana/grafana/pkg/infra/httpclient"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/services/accesscontrol"
	"github.com/grafana/grafana/pkg/services/datasources"
	"github.com/grafana/grafana/pkg/services/ngalert/eval"
	ngmodels "github.com/grafana/grafana/pkg/services/ngalert/models"
	"github.com/grafana/grafana/pkg/services/org"
	"github.com/grafana/grafana/pkg/services/pluginsintegration/adapters"
	"github.com/grafana/grafana/pkg/util"
	"github.com/m3db/prometheus_remote_client_golang/promremote"
)

type recordingRule struct {
	ctx    context.Context
	evalCh chan *Evaluation
	stopFn util.CancelCauseFunc

	evalFactory        eval.EvaluatorFactory
	datasourceCache    datasources.CacheService
	decryptFn          func(*datasources.DataSource) (map[string]string, error)
	httpClientProvider httpclient.Provider

	logger log.Logger
}

func newRecordingRule(ctx context.Context, evalFactory eval.EvaluatorFactory, datasourceCache datasources.CacheService, dsDecryptFn func(*datasources.DataSource) (map[string]string, error), httpClientProvider httpclient.Provider, logger log.Logger) *recordingRule {
	ctx, stop := util.WithCancelCause(ctx)
	return &recordingRule{
		ctx:                ctx,
		evalCh:             make(chan *Evaluation),
		stopFn:             stop,
		evalFactory:        evalFactory,
		decryptFn:          dsDecryptFn,
		datasourceCache:    datasourceCache,
		httpClientProvider: httpClientProvider,
		logger:             logger,
	}
}

func (r *recordingRule) Eval(eval *Evaluation) (bool, *Evaluation) {
	// read the channel in unblocking manner to make sure that there is no concurrent send operation.
	var droppedMsg *Evaluation
	select {
	case droppedMsg = <-r.evalCh:
	default:
	}

	select {
	case r.evalCh <- eval:
		return true, droppedMsg
	case <-r.ctx.Done():
		return false, droppedMsg
	}
}

func (r *recordingRule) Update(lastVersion RuleVersionAndPauseStatus) bool {
	// Recording rules are stateless, and so do no work on Update.
	return true
}

func (r *recordingRule) Run(key ngmodels.AlertRuleKey) error {
	grafanaCtx := ngmodels.WithRuleKey(r.ctx, key)
	logger := r.logger.FromContext(grafanaCtx)
	logger.Info("Recording rule routine started")

	evalRunning := false
	for {
		select {
		case eval, ok := <-r.evalCh:
			if !ok {
				logger.Debug("Evaluation channel has been closed. Exiting")
				return nil
			}
			if evalRunning {
				continue
			}

			func() {
				evalRunning = true
				defer func() {
					evalRunning = false
				}()

				if eval.rule.IsPaused {
					logger.Debug("Skip rule evaluation because it is paused")
					return
				}

				if grafanaCtx.Err() != nil {
					logger.Error("Skipping recording rule evaluation because the context has been cancelled")
					return
				}

				if err := r.evaluate(grafanaCtx, key, eval); err != nil {
					logger.Error("Failed to evaluate recording rule", "error", err)
				}
			}()
		case <-grafanaCtx.Done():
			logger.Info("Stopping recording rule routine")
			return nil
		}
	}
}

func (r *recordingRule) Stop(reason error) {
	if r.stopFn != nil {
		r.stopFn(reason)
	}
}

func (r *recordingRule) evaluate(ctx context.Context, key ngmodels.AlertRuleKey, ev *Evaluation) error {
	logger := r.logger.FromContext(ctx).New("now", ev.scheduledAt).FromContext(ctx)

	evalCtx := eval.NewContext(ctx, SchedulerUserFor(ev.rule.OrgID))

	evaluator, err := r.evalFactory.Create(evalCtx, ev.rule.GetRecordingCondition())
	var results *backend.QueryDataResponse
	if err != nil {
		logger.Error("Failed to build recording rule evaluator", "error", err)
		// Fallthrough any errors.
	} else {
		results, err = evaluator.EvaluateRaw(ctx, ev.scheduledAt)
		if err != nil {
			logger.Error("Failed to evaluate rule", "error", err)
		}
	}

	if ctx.Err() != nil {
		logger.Debug("Skipping writing the recording rule because the context has been cancelled")
		return nil
	}

	if err != nil {
		logger.Error("Rule evaluation failed", "error", err)
	}

	// TODO: Sometimes the QueryDataResponse can include error frames - parse these out.
	// TODO: (equivalent of results.HasErrors() but for raw frames)

	logger.Info("\n\n\n\n=============\n\n\n\n")

	responseJSON, _ := json.Marshal(results)
	logger.Info("Recording rule evaluated", "ruleName", ev.rule.Title, "ruleGroup", ev.rule.RuleGroup, "results", string(responseJSON))

	metrics, convErr := FramesToMetrics(ctx, results, err, ev.rule, ev.scheduledAt, logger)
	err = nil
	if convErr != nil {
		logger.Error("Failed to convert frames to Metrics intermediate representation", "error", convErr)
		return nil // TODO: Even if convErr we still get a NaN metric that we want to write. Probably don't exit, in reality
	}

	metricsJSON, _ := json.Marshal(metrics)
	logger.Info("Metrics converted from frame", "results", string(metricsJSON))

	promClient, err := r.buildPrometheusClient(ctx, ev.rule, logger)
	if err != nil {
		logger.Error("Failed to build prometheus client", "error", err)
		return nil
	}

	writer := NewWriter(promClient)
	err = writer.Write(ctx, metrics)
	if err != nil {
		logger.Error("Failed to write metrics", "error", err)
	}

	logger.Info("Recording rule successfully evaluated")
	return nil
}

func (r *recordingRule) buildPrometheusClient(ctx context.Context, rule *ngmodels.AlertRule, logger log.Logger) (promremote.Client, error) {
	user := accesscontrol.BackgroundUser("recording_rule_writer", rule.OrgID, org.RoleAdmin, []accesscontrol.Permission{
		{Action: datasources.ActionRead, Scope: datasources.ScopeAll},
	})
	ds, err := r.datasourceCache.GetDatasourceByUID(ctx, rule.RecordTo.UID, user, false)
	if err != nil {
		return nil, fmt.Errorf("failed to lookup datasource by uid: %w", err)
	}

	settings, err := adapters.ModelToInstanceSettings(ds, r.decryptFn)
	if err != nil {
		return nil, fmt.Errorf("failed to decrypt datasource settings: %w", err)
	}

	logger.Info("decrypted datasource settings", "settings", settings)

	clientOpts, err := settings.HTTPClientOptions(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to read HTTP client options from settings: %w", err)
	}

	logger.Info("parsed client opts", "opts", clientOpts)

	rt, err := r.httpClientProvider.GetTransport(sdk_httpclient.Options{
		Timeouts:  clientOpts.Timeouts,
		TLS:       clientOpts.TLS,
		BasicAuth: clientOpts.BasicAuth,
	})
	if err != nil {
		return nil, fmt.Errorf("failed to build transport: %w", err)
	}

	u, err := url.Parse(settings.URL)
	if err != nil {
		return nil, fmt.Errorf("datasource contained an invalid URL: %w", err)
	}
	u.Path = "/api/v1/write"

	conf := promremote.NewConfig(
		promremote.WriteURLOption(u.String()),
		promremote.UserAgent("grafana-recording-rule"),
		promremote.HTTPClientTimeoutOption(30*time.Second),
		promremote.HTTPClientOption(&http.Client{Transport: rt}),
	)

	return promremote.NewClient(conf)
}
