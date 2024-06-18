import React from 'react';
import { render, userEvent } from 'test/test-utils';
import { byRole, byText } from 'testing-library-selector';

import { setupMswServer } from 'app/features/alerting/unified/mockApi';
import { setFolderAccessControl } from 'app/features/alerting/unified/mocks/server/configure';
import { setupDataSources } from 'app/features/alerting/unified/testSetup/datasources';
import { AlertManagerDataSourceJsonData } from 'app/plugins/datasource/alertmanager/types';
import { AccessControlAction } from 'app/types';

import RuleList from './RuleList';
import { grantUserPermissions, mockDataSource } from './mocks';
import { setupPluginsExtensionsHook } from './testSetup/plugins';
import { DataSourceType, GRAFANA_RULES_SOURCE_NAME } from './utils/datasource';

setupPluginsExtensionsHook();

const dataSources = {
  prom: mockDataSource({
    name: 'Prometheus',
    type: DataSourceType.Prometheus,
  }),
  grafana: mockDataSource<AlertManagerDataSourceJsonData>({
    name: GRAFANA_RULES_SOURCE_NAME,
    type: DataSourceType.Alertmanager,
    jsonData: {
      handleGrafanaManagedAlerts: true,
    },
  }),
};

const ui = {
  ruleGroup: byText(/test-folder-1/),
  stateTags: {
    paused: byText(/^Paused/),
  },
  actionButtons: {
    more: byRole('button', { name: /More/ }),
  },
  moreActionItems: {
    pauseResume: byRole('menuitem', { name: /(pause|resume) evaluation/i }),
  },
};

setupMswServer();

const grantPermissionsHelper = (permissions: AccessControlAction[]) => {
  const permissionsHash = permissions.reduce((hash, permission) => ({ ...hash, [permission]: true }), {});
  grantUserPermissions(permissions);
  setFolderAccessControl(permissionsHash);
};

describe('RuleList', () => {
  describe('pausing rules', () => {
    beforeEach(() => {
      grantPermissionsHelper([
        AccessControlAction.AlertingInstanceCreate,
        AccessControlAction.AlertingInstanceUpdate,
        AccessControlAction.AlertingInstanceRead,
        AccessControlAction.AlertingRuleRead,
        AccessControlAction.AlertingRuleUpdate,
        AccessControlAction.AlertingRuleExternalRead,
        AccessControlAction.AlertingRuleExternalWrite,
      ]);

      setupDataSources(dataSources.grafana);
    });

    test('resuming paused alert rule', async () => {
      const user = userEvent.setup();
      render(<RuleList />);

      // Expand the rule group so we can assert the rule state
      await user.click(await ui.ruleGroup.find());

      await user.click(await ui.actionButtons.more.find());

      await user.click(await ui.moreActionItems.pauseResume.find());
    });
  });
});
