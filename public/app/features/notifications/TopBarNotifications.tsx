import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { Link, useStyles2 } from '@grafana/ui';

import { SeverityCounter } from './SeverityCounter';
import { useNotificationGroups } from './hooks';
import { countSeverities } from './utils';

export function TopBarNotifications() {
  const styles = useStyles2(getStyles);
  const { groups } = useNotificationGroups();

  if (!groups.length) {
    return null;
  }

  return (
    <Link href="/notifications">
      <div className={styles.container}>
        <SeverityCounter count={countSeverities(groups)} />
      </div>
    </Link>
  );
}

function getStyles(theme: GrafanaTheme2) {
  return {
    container: css`
      height: 32px;
      display: flex;
      align-items: center;
    `,
  };
}
