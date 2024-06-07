import { NavModel } from '@grafana/data';
import { AppChromeState } from 'app/core/components/AppChrome/AppChromeService';
import { HOME_NAV_ID } from 'app/core/reducers/navModel';
import { StateManagerBase } from 'app/core/services/StateManagerBase';

import { HistoryEntryApp } from './types';

export interface HistoryState {
  entries: HistoryEntryApp[];
}

export class HistoryStateManager extends StateManagerBase<HistoryState> {
  constructor() {
    super({ entries: [] });
  }

  public handleAppChromeState(newState: AppChromeState, currentState: AppChromeState) {
    const pageName = newState.pageNav?.text || newState.sectionNav.node.text;
    const sectionName = this.getSectionName(newState.sectionNav);
    const oldPageName = currentState.pageNav?.text || currentState.sectionNav.node.text;

    let entries = this.state.entries;
    let lastEntry = entries[0];

    const oldSectionName = entries[0]?.name;

    if (!sectionName) {
      return;
    }

    if (sectionName !== oldSectionName) {
      lastEntry = { name: sectionName, views: [] };
    }

    if (pageName !== oldPageName && oldPageName) {
      // Filter out the view if it already exists so we do not add same view twice
      lastEntry.views = lastEntry.views.filter((view) => view.name !== pageName);
      lastEntry.views.unshift({ name: pageName, url: window.location.href });
      console.log('adding entry view', pageName);
    }

    if (lastEntry !== entries[0]) {
      this.setState({ entries: [lastEntry, ...entries] });
    }
  }

  private getSectionName(navModel: NavModel) {
    const sectionRootName = navModel.main.text;
    const parentName = navModel.node.parentItem?.text;
    const parentId = navModel.node.parentItem?.id;

    // For deeper level sections (apps)
    if (sectionRootName !== parentName && sectionRootName && parentId !== HOME_NAV_ID) {
      return `${sectionRootName} / ${parentName}`;
    }

    return navModel.main.text;
  }
}

let instance: HistoryStateManager;

export function getHistoryStateManager() {
  if (!instance) {
    instance = new HistoryStateManager();
  }

  return instance;
}
