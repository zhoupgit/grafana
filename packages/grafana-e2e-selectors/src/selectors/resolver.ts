import { Components } from '../generated/components.gen';
import { Pages } from '../generated/pages.gen';
import { E2ESelectors, VersionedSelectors } from '../types';

import { versionedAPIs } from './apis';
import { versionedComponents } from './components';
import { versionedPages } from './pages';

const semver = require('semver');

type Selectors = { pages: E2ESelectors<typeof Pages>; components: E2ESelectors<typeof Components> };

const processSelectors = (
  selectors: Selectors,
  versionedSelectors: VersionedSelectors,
  grafanaVersion: string
): Selectors => {
  const keys = Object.keys(versionedSelectors);
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    // @ts-ignore
    const value = versionedSelectors[key];

    if (typeof value === 'object' && Object.keys(value).length > 0 && !semver.valid(Object.keys(value)[0])) {
      // @ts-ignore
      selectors[key] = processSelectors({}, value, grafanaVersion);
    } else {
      if (typeof value === 'object' && Object.keys(value).length > 0 && semver.valid(Object.keys(value)[0])) {
        // @ts-ignore
        const sorted = Object.keys(value).sort(semver.rcompare);
        let validVersion = sorted[0];
        for (let index = 0; index < sorted.length; index++) {
          const version = sorted[index];
          if (semver.gte(grafanaVersion, version)) {
            validVersion = version;
            break;
          }
        }
        // @ts-ignore
        selectors[key] = value[validVersion];
      } else {
        // @ts-ignore
        selectors[key] = value;
      }
    }

    continue;
  }

  return selectors;
};

/**
 * Resolves selectors based on the Grafana version
 *
 * If the selector has multiple versions, the last version that is less
 * than or equal to the Grafana version will be returned.
 * If the selector doesn't have a version, it will be returned as is.
 */
export const resolveSelectors = (grafanaVersion: string): Selectors => {
  const selectors: Selectors = {} as Selectors;
  const versionedSelectors = {
    pages: versionedPages,
    components: versionedComponents,
    apis: versionedAPIs,
  };

  return processSelectors(selectors, versionedSelectors, grafanaVersion.replace(/\-.*/, ''));
};
