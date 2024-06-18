/**
 * Contains all handlers that are required for test rendering of components within Alerting
 */

import alertRulesHandlers from 'app/features/alerting/unified/mocks/server/handlers/alertRules';
import alertmanagerHandlers from 'app/features/alerting/unified/mocks/server/handlers/alertmanagers';
import dashboardHandlers from 'app/features/alerting/unified/mocks/server/handlers/dashboards';
import datasourcesHandlers from 'app/features/alerting/unified/mocks/server/handlers/datasources';
import evalHandlers from 'app/features/alerting/unified/mocks/server/handlers/eval';
import folderHandlers from 'app/features/alerting/unified/mocks/server/handlers/folders';
import pluginsHandlers from 'app/features/alerting/unified/mocks/server/handlers/plugins';
import prometheusHandlers from 'app/features/alerting/unified/mocks/server/handlers/prometheus';
import silenceHandlers from 'app/features/alerting/unified/mocks/server/handlers/silences';
import userHandlers from 'app/features/alerting/unified/mocks/server/handlers/user';

/**
 * Array of all mock handlers that are required across Alerting tests
 */
const allHandlers = [
  ...alertRulesHandlers,
  ...alertmanagerHandlers,
  ...dashboardHandlers,
  ...datasourcesHandlers,
  ...evalHandlers,
  ...folderHandlers,
  ...pluginsHandlers,
  ...prometheusHandlers,
  ...silenceHandlers,
  ...userHandlers,
];

export default allHandlers;
