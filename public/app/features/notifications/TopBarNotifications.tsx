import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { Link, Tooltip, useStyles2 } from '@grafana/ui';

import { SeverityCounter } from './SeverityCounter';
import { SeverityIcon } from './SeverityIcon';
import { useNotificationGroups } from './hooks';
import { countSeverities } from './utils';

export function TopBarNotifications() {
  const styles = useStyles2(getStyles);
  const { groups } = useNotificationGroups();

  if (!groups.length) {
    return null;
  }

  const popoverContent = (
    <div>
      {groups.map((group) => {
        return (
          <div key={group.title}>
            <div className={styles.groupTitle}>{group.title}</div>
            <div>
              {group.notifications.map((notification) => {
                return (
                  <div key={notification.id} className={styles.item}>
                    <SeverityIcon severity={notification.severity} />
                    <span className={styles.itemTitle}>{notification.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <Link href="/notifications">
      <Tooltip content={popoverContent}>
        <div className={styles.container}>
          <SeverityCounter count={countSeverities(groups)} />
        </div>
      </Tooltip>
    </Link>
  );
}

function getStyles(theme: GrafanaTheme2) {
  return {
    groupTitle: css`
      font-weight: bold;
      padding-top: 4px;
    `,
    item: css`
      display: flex;
      align-items: center;
    `,
    itemTitle: css`
      padding-left: ${theme.spacing(0.5)};
    `,
    container: css`
      height: 32px;
      display: flex;
      align-items: center;
    `,
  };
}
