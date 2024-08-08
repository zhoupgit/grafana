import { NotificationSeverity } from '@grafana/data';
import { Icon } from '@grafana/ui';

import { severity2Color } from './constants';

interface SeverityIconProps {
  severity: NotificationSeverity;
}

export function SeverityIcon({ severity }: SeverityIconProps) {
  switch (severity) {
    case NotificationSeverity.Error:
      return <Icon name="info-circle" color={severity2Color[NotificationSeverity.Error]} />;
    case NotificationSeverity.Warning:
      return <Icon name="exclamation-triangle" color={severity2Color[NotificationSeverity.Warning]} />;
    case NotificationSeverity.Info:
      return <Icon name="info-circle" color={severity2Color[NotificationSeverity.Info]} />;
    default:
      return nevah(severity);
  }
}

function nevah(x: never): never {
  throw new Error(`nevah ${x}`);
}
