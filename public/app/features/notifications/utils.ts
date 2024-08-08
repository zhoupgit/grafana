import { isArray } from 'lodash';

import { NotificationGroup, NotificationSeverity } from '@grafana/data';

export function countSeverities(group: NotificationGroup | NotificationGroup[]): Record<NotificationSeverity, number> {
  const counts: Record<NotificationSeverity, number> = {
    [NotificationSeverity.Error]: 0,
    [NotificationSeverity.Warning]: 0,
    [NotificationSeverity.Info]: 0,
  };

  const groups = isArray(group) ? group : [group];

  for (const notification of groups.flatMap((g) => g.notifications)) {
    counts[notification.severity]++;
  }

  return counts;
}
