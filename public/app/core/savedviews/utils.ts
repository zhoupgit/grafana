import { dispatch } from '../../store/store';
import { contextSrv } from '../core';

import { AddSavedViewCommand, SavedView, savedViewApi } from './api';

export function getUserUid(): string {
  return contextSrv.user.uid || contextSrv.user.id.toString();
}

export function myView(view: SavedView) {
  return view.user === getUserUid();
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
  save() {
    dispatch(savedViewApi.endpoints.addSavedView.initiate(this.getCommand()));
  }
  async push(view: SavedView) {}
  update(view: AddSavedViewCommand) {}
  register(id: string, callback: (view: AddSavedViewCommand) => AddSavedViewCommand) {
    this.processors[id] = callback;
  }
  unregister(id: string) {
    delete this.processors[id];
  }
}

export const savedViewsService = new SavedViewsService();
