package notifier

import (
	"github.com/prometheus/alertmanager/config"

	alertingNotify "github.com/grafana/alerting/notify"
	alertingTemplates "github.com/grafana/alerting/templates"

	"github.com/grafana/grafana/pkg/components/simplejson"
	apimodels "github.com/grafana/grafana/pkg/services/ngalert/api/tooling/definitions"
	"github.com/grafana/grafana/pkg/services/ngalert/models"
)

func GrafanaIntegrationConfigToGettable(r *alertingNotify.GrafanaIntegrationConfig, provenance models.Provenance) (apimodels.GettableGrafanaReceiver, error) {
	out := apimodels.GettableGrafanaReceiver{
		UID:                   r.UID,
		Name:                  r.Name,
		Type:                  r.Type,
		Provenance:            apimodels.Provenance(provenance),
		DisableResolveMessage: r.DisableResolveMessage,
		SecureFields:          make(map[string]bool, len(r.SecureSettings)),
	}

	if r.Settings == nil && r.SecureSettings == nil {
		return out, nil
	}

	settings := simplejson.New()
	if r.Settings != nil {
		var err error
		settings, err = simplejson.NewJson(r.Settings)
		if err != nil {
			return apimodels.GettableGrafanaReceiver{}, err
		}
	}

	for k, v := range r.SecureSettings {
		if v == "" {
			continue
		}
		settings.Set(k, v)
		out.SecureFields[k] = true
	}

	jsonBytes, err := settings.MarshalJSON()
	if err != nil {
		return apimodels.GettableGrafanaReceiver{}, err
	}

	out.Settings = jsonBytes

	return out, nil
}

func ReceiverToGettable(r *models.Receiver) (apimodels.GettableApiReceiver, error) {
	out := apimodels.GettableApiReceiver{
		Receiver: config.Receiver{
			Name: r.ConfigReceiver.Name,
		},
		GettableGrafanaReceivers: apimodels.GettableGrafanaReceivers{
			GrafanaManagedReceivers: make([]*apimodels.GettableGrafanaReceiver, 0, len(r.Integrations)),
		},
	}

	for _, gr := range r.Integrations {
		gettable, err := GrafanaIntegrationConfigToGettable(gr, r.Provenance)
		if err != nil {
			return apimodels.GettableApiReceiver{}, err
		}
		out.GrafanaManagedReceivers = append(out.GrafanaManagedReceivers, &gettable)
	}

	return out, nil
}

// ToTemplateDefinitions converts the given PostableUserConfig's TemplateFiles to a slice of TemplateDefinitions.
func ToTemplateDefinitions(cfg *apimodels.PostableUserConfig) []alertingTemplates.TemplateDefinition {
	out := make([]alertingTemplates.TemplateDefinition, 0, len(cfg.TemplateFiles))
	for name, tmpl := range cfg.TemplateFiles {
		out = append(out, alertingTemplates.TemplateDefinition{
			Name:     name,
			Template: tmpl,
		})
	}
	return out
}

// Silence-specific compat functions to convert between grafana/alerting and model types.

func GettableSilenceToSilence(s alertingNotify.GettableSilence) *models.Silence {
	sil := models.Silence(s)
	return &sil
}

func GettableSilencesToSilences(silences alertingNotify.GettableSilences) []*models.Silence {
	res := make([]*models.Silence, 0, len(silences))
	for _, sil := range silences {
		res = append(res, GettableSilenceToSilence(*sil))
	}
	return res
}

func SilenceToPostableSilence(s models.Silence) *alertingNotify.PostableSilence {
	var id string
	if s.ID != nil {
		id = *s.ID
	}
	return &alertingNotify.PostableSilence{
		ID:      id,
		Silence: s.Silence,
	}
}
