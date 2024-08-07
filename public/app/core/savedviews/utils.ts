import { BusEventBase, BusEventWithPayload } from '@grafana/data';

import { dispatch } from '../../store/store';
import { contextSrv } from '../core';

import { AddSavedViewCommand, HistoryView, SavedView, savedViewApi } from './api';

export function getUserUid(): string {
  return contextSrv.user.uid || contextSrv.user.id.toString();
}

export function myView(view: SavedView) {
  return view.user === getUserUid();
}

export class OpenSavedViewsEvent extends BusEventBase {
  static type = 'open-saved-views';
}

class SavedViewsService {
  processors: Record<string, (view: AddSavedViewCommand) => AddSavedViewCommand> = {};
  getCommand() {
    let view: AddSavedViewCommand = {
      name: window.document.title.replace('- Grafana', '') || '',
      url: window.location.href,
      description: '(no description)',
      icon: 'link',
    };
    Object.values(this.processors).forEach((processor) => {
      view = processor(view);
    });
    return view;
  }
  getHistoryCommand(): HistoryView {
    const command = this.getCommand();
    return {
      name: command.name,
      url: command.url,
      description: command.description,
      icon: command.icon,
    } as HistoryView;
  }
  save() {
    dispatch(savedViewApi.endpoints.addSavedView.initiate(this.getCommand()));
  }
  reSave(view: SavedView) {
    dispatch(
      savedViewApi.endpoints.addSavedView.initiate({
        name: view.name,
        url: view.url,
        description: view.description,
        icon: view.icon,
      })
    );
  }
  saveFromHistory(history: HistoryView) {
    dispatch(
      savedViewApi.endpoints.addSavedView.initiate({
        name: history.name,
        url: history.url,
        description: history.description,
        icon: history.icon,
      })
    );
  }
  getHistory() {
    const historyRaw = window.localStorage.getItem('history.views') || '[]';
    const history = JSON.parse(historyRaw);
    const reversed = (history as HistoryView[]).reverse();
    return reversed.map((item, index) => {
      return {
        ...item,
        index,
      };
    });
  }
  private saveHistory(views: HistoryView[]) {
    const historyRaw = JSON.stringify(views);
    window.localStorage.setItem('history.views', historyRaw);
  }
  pushHistory(view?: HistoryView) {
    setTimeout(() => {
      const history = this.getHistory();
      history.unshift(view || this.getHistoryCommand());
      this.saveHistory(history);
    }, 1);
  }
  updateHistory(view?: HistoryView) {
    setTimeout(() => {
      const history = this.getHistory();
      history[0] = view || this.getHistoryCommand();
      this.saveHistory(history);
    }, 1);
  }
  deleteHistory(view: HistoryView) {
    let history = this.getHistory();
    history.splice(view.index!, 1);
    this.saveHistory(history);
  }
  register(id: string, callback: (view: AddSavedViewCommand) => AddSavedViewCommand) {
    this.processors[id] = callback;
  }
  unregister(id: string) {
    delete this.processors[id];
  }
  clearHistory() {
    this.saveHistory([]);
  }
}

export const savedViewsService = new SavedViewsService();
