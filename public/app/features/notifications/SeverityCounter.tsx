import { css, cx } from '@emotion/css';

import { GrafanaTheme2, NotificationSeverity } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';

import { SeverityIcon } from './SeverityIcon';
import { severity2Color } from './constants';

interface SeverityCounterProps {
  count: Record<NotificationSeverity, number>;
  className?: string;
}

export function SeverityCounter({ count, className }: SeverityCounterProps) {
  const items = Object.entries(count).filter(([_, value]) => value > 0);

  const styles = useStyles2(getStyles);

  if (!items.length) {
    return null;
  }

  return (
    <div className={cx(styles.container, className)}>
      {items.map(([severity, count]) => (
        <SeverityCountItem key={severity} severity={severity as NotificationSeverity} count={count} />
      ))}
    </div>
  );
}

export function SeverityCountItem({ severity, count }: { severity: NotificationSeverity; count: number }) {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.item}>
      <SeverityIcon severity={severity} />
      <span className={styles.count} style={{ color: severity2Color[severity] }}>
        {count}
      </span>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: inline-flex;
    margin-left: ${theme.spacing(0.5)};
  `,
  item: css`
    display: flex;
    align-items: center;
    margin-left: ${theme.spacing(0.5)};

    & > svg {
      margin-right: 3px !important;
    }
  `,
  count: css`
    font-weight: bold;
  `,
});
