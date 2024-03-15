package api

import (
	"bytes"
	"encoding/json"
	"net/http"

	"github.com/grafana/grafana/pkg/api/response"
	contextmodel "github.com/grafana/grafana/pkg/services/contexthandler/model"
	"github.com/grafana/grafana/pkg/services/datasources"
	"github.com/grafana/grafana/pkg/web"
)

func ConvertMapStringToStringByte(inputMap map[string]string) map[string][]byte {
	result := make(map[string][]byte)
	for key, value := range inputMap {
		result[key] = []byte(value)
	}
	return result
}

type MigrateCommand struct {
	TargetUrl   string `json:"targetUrl"`
	TargetToken string `json:"targetToken"`
}

func (hs *HTTPServer) MigrateResources(c *contextmodel.ReqContext) response.Response {
	cmd := MigrateCommand{}
	if err := web.Bind(c.Req, &cmd); err != nil {
		return response.Error(http.StatusBadRequest, "bad request data", err)
	}

	dsources, err := hs.DataSourcesService.GetAllDataSources(c.Req.Context(), nil)
	if err != nil {
		return response.Error(http.StatusBadRequest, "failed to get all datasources", err)
	}

	folders, err := hs.folderService.GetAllFolders(c.Req.Context())
	if err != nil {
		return response.Error(http.StatusBadRequest, "failed to get all folders", err)
	}

	dashboards, err := hs.DashboardService.GetAllDashboards(c.Req.Context())
	if err != nil {
		return response.Error(http.StatusBadRequest, "failed to get all dashboards", err)
	}

	// Push datasources
	for _, ds := range dsources {

		// Decrypt secure json to send raw credentials
		jdata, err := hs.SecretsService.DecryptJsonData(c.Req.Context(), ds.SecureJsonData)

		dsCmd := &datasources.AddDataSourceCommand{
			OrgID:           ds.OrgID,
			Name:            ds.Name,
			Type:            ds.Type,
			Access:          ds.Access,
			URL:             ds.URL,
			User:            ds.User,
			Database:        ds.Database,
			BasicAuth:       ds.BasicAuth,
			BasicAuthUser:   ds.BasicAuthUser,
			WithCredentials: ds.WithCredentials,
			IsDefault:       ds.IsDefault,
			JsonData:        ds.JsonData,
			SecureJsonData:  jdata,
			ReadOnly:        ds.ReadOnly,
			UID:             ds.UID,
		}

		data, err := json.Marshal(dsCmd)
		if err != nil {
			return response.Error(http.StatusBadRequest, "failed to marshal all datasources", err)
		}
		req, err := http.NewRequest(http.MethodPost, cmd.TargetUrl+"/api/datasources", bytes.NewBuffer(data))
		if err != nil {
			return response.Error(http.StatusBadRequest, "failed to create req for all datasources", err)
		}
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+cmd.TargetToken)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return response.Error(http.StatusBadRequest, "failed to push all datasources", err)
		}
		resp.Body.Close()
	}

	// Push folders
	for _, folder := range folders {
		data, err := json.Marshal(folder)
		if err != nil {
			return response.Error(http.StatusBadRequest, "failed to marshal all folders", err)
		}
		req, err := http.NewRequest(http.MethodPost, cmd.TargetUrl+"/api/folders", bytes.NewBuffer(data))
		if err != nil {
			return response.Error(http.StatusBadRequest, "failed to create req for all folders", err)
		}
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+cmd.TargetToken)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return response.Error(http.StatusBadRequest, "failed to push all folders", err)
		}
		resp.Body.Close()
	}

	// Push dashboards
	for _, dashboard := range dashboards {
		data, err := json.Marshal(dashboard.GetSaveDashboardCommand())
		if err != nil {
			return response.Error(http.StatusBadRequest, "failed to marshal all dashboards", err)
		}
		req, err := http.NewRequest(http.MethodPost, cmd.TargetUrl+"/api/dashboards/db", bytes.NewBuffer(data))
		if err != nil {
			return response.Error(http.StatusBadRequest, "failed to create req for all dashboards", err)
		}
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+cmd.TargetToken)

		client := &http.Client{}
		resp, err := client.Do(req)
		if err != nil {
			return response.Error(http.StatusBadRequest, "failed to push all dashboards", err)
		}
		resp.Body.Close()
	}

	return response.JSON(http.StatusOK, nil)
}
