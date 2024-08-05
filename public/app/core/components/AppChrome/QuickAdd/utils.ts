import { NavModelItem } from '@grafana/data';

import { SavedViewsMenuItem } from './SavedViewsMenuItem';

/**
 * TODO allow to register processors
 */
function processCreateAction(item: NavModelItem): NavModelItem {
  if (item.id === 'save-view') {
    return {
      ...item,
      CustomMenuItem: SavedViewsMenuItem,
    };
  }
  return {
    ...item,
  };
}

export function findCreateActions(navTree: NavModelItem[]): NavModelItem[] {
  const results: NavModelItem[] = [];
  for (const navItem of navTree) {
    if (navItem.isCreateAction) {
      results.push(processCreateAction(navItem));
    }
    if (navItem.children) {
      results.push(...findCreateActions(navItem.children));
    }
  }
  return results;
}
