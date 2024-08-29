import { defaults } from 'lodash';

import { PanelModel as PanelModelFromData, PanelPlugin } from '@grafana/data';
import { autoMigrateAngular, PanelModel } from 'app/features/dashboard/state/PanelModel';

export function getAngularPanelMigrationHandler(oldModel: PanelModel) {
  return function handleAngularPanelMigrations(panel: PanelModelFromData, plugin: PanelPlugin) {
    if (plugin.angularPanelCtrl) {
      panel.options = { angularOptions: oldModel.getOptionsToRemember() };
      console.warn('Deprecated Angular panel detected with angularPanelCtrl', plugin);
      return;
    }

    if (!oldModel.options || Object.keys(oldModel.options).length === 0) {
      console.warn('No options found for panel', oldModel);
      defaults(panel, oldModel.getOptionsToRemember());
    }

    if (oldModel.autoMigrateFrom) {
      const wasAngular = autoMigrateAngular[oldModel.autoMigrateFrom] != null;
      const oldOptions = oldModel.getOptionsToRemember();
      const prevPluginId = oldModel.autoMigrateFrom;
      console.warn('Auto migrating panel', oldModel, 'from', prevPluginId, 'to', plugin.meta.id);
      if (plugin.onPanelTypeChanged) {
        const prevOptions = wasAngular ? { angular: oldOptions } : oldOptions.options;
        Object.assign(panel.options, plugin.onPanelTypeChanged(panel, prevPluginId, prevOptions, panel.fieldConfig));
      }
    }
  };
}
