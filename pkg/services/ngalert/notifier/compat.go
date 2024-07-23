package notifier

import (
	alertingNotify "github.com/grafana/alerting/notify"
	alertingTemplates "github.com/grafana/alerting/templates"

	apimodels "github.com/grafana/grafana/pkg/services/ngalert/api/tooling/definitions"
	"github.com/grafana/grafana/pkg/services/ngalert/models"
)

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
