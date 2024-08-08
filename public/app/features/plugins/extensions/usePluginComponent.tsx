import { useMemo } from 'react';
import { useObservable } from 'react-use';

import { UsePluginComponentResult } from '@grafana/runtime';

import { ExportedComponentRegistry } from './registry/ExportedComponentRegistry';
import { isPluginExtensionComponentConfig, wrapWithPluginContext } from './utils';

// Returns a component exposed by a plugin.
// (Exposed components can be defined in plugins by calling .exposeComponent() on the AppPlugin instance.)
export function createUsePluginComponent(registry: ExportedComponentRegistry) {
  const observableRegistry = registry.asObservable();

  return function usePluginComponent<Props extends object = {}>(id: string): UsePluginComponentResult<Props> {
    const registry = useObservable(observableRegistry);

    return useMemo(() => {
      if (!registry) {
        return {
          isLoading: false,
          component: null,
        };
      }

      const registryItems = registry.extensions[id];
      const registryItem = Array.isArray(registryItems) ? registryItems[0] : null;

      if (registryItem && isPluginExtensionComponentConfig<Props>(registryItem.config)) {
        return {
          isLoading: false,
          component: wrapWithPluginContext(registryItem.pluginId, registryItem.config.component),
        };
      }

      return {
        isLoading: false,
        component: null,
      };
    }, [id, registry]);
  };
}
