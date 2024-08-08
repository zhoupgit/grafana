import { NotificationSeverity } from '@grafana/data';

export const severity2Color: Record<NotificationSeverity, string> = {
  [NotificationSeverity.Error]: 'red',
  [NotificationSeverity.Warning]: '#ff8000',
  [NotificationSeverity.Info]: 'blue',
};
