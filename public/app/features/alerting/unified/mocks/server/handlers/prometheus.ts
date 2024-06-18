import { HttpResponse, http } from 'msw';

import { getMockPrometheusRules } from 'app/features/alerting/unified/mocks/server/mock-data/prometheus';

const getPrometheusRulesHandler = (rules = getMockPrometheusRules()) =>
  http.get('/api/prometheus/grafana/api/v1/rules', () => {
    return HttpResponse.json(rules);
  });

const handlers = [getPrometheusRulesHandler()];

export default handlers;
