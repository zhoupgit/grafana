import { css } from '@emotion/css';

import { GrafanaTheme2, LoadingState } from '@grafana/data';
import { Alert, Stack, Tab, TabsBar, useStyles2 } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { useQueryParams } from 'app/core/hooks/useQueryParams';

import { SeverityCounter } from './SeverityCounter';
import { useNotificationGroups } from './hooks';
import { countSeverities } from './utils';

export const NewNotificationsPage = () => {
  const { groups, state } = useNotificationGroups();
  const styles = useStyles2(getStyles);

  const [params, replace] = useQueryParams();

  let activeTab = params['tab'] ?? groups[0]?.id;

  const group = groups.find((group) => group.id === activeTab);

  return (
    <Page navId="notifications">
      <Page.Contents>
        {state === LoadingState.Loading && !groups.length && <p>Loading...</p>}
        {!groups.length && state !== LoadingState.Loading && <p>No active notifications.</p>}
        {!!groups.length && (
          <>
            <TabsBar className={styles.tabsBar}>
              {groups.map((group) => {
                return (
                  <Tab
                    active={activeTab === group.id}
                    key={group.title}
                    label={group.title}
                    onChangeTab={() => replace({ tab: group.id })}
                    suffix={() => <SeverityCounter className={styles.tabCounter} count={countSeverities(group)} />}
                  />
                );
              })}
            </TabsBar>
            {group && (
              <Stack direction="column" maxWidth="1000px">
                {group.notifications.map((notification) => {
                  return (
                    <Alert key={notification.id} title={notification.title} severity={notification.severity}>
                      {notification.description}
                    </Alert>
                  );
                })}
              </Stack>
            )}
          </>
        )}
      </Page.Contents>
    </Page>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  tabsBar: css`
    margin-bottom: ${theme.spacing(1)};
  `,
  tabCounter: css`
    vertical-align: bottom;
  `,
});

export default NewNotificationsPage;
