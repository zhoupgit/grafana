import { contextSrv } from '../core';

import { SavedView } from './api';

export function getUserUid(): string {
  return contextSrv.user.uid || contextSrv.user.id.toString();
}

export function myView(view: SavedView) {
  return view.user === getUserUid();
}
