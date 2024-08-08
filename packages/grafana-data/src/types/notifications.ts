import React from 'react';

import { LoadingState } from './data';
import { IconName } from './icon';

export enum NotificationSeverity {
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

export const SEVERITIES: NotificationSeverity[] = [
  NotificationSeverity.Error,
  NotificationSeverity.Warning,
  NotificationSeverity.Info,
];

export interface NotificationUpdate {
  state: LoadingState;
  groups: NotificationGroup[];
}

export interface NotificationGroup {
  id: string;
  title: string;
  icon: IconName;
  sortWeight?: number;
  iconColor?: string;
  notifications: Notification[];
}

export interface Notification {
  id: string;
  title: string;
  icon?: IconName;
  severity: NotificationSeverity;
  description?: React.ReactNode;
}
