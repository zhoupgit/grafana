import { css } from '@emotion/css';
import React, { useState } from 'react';
import { useToggle } from 'react-use';

import { GrafanaTheme2 } from '@grafana/data';
import { Drawer, IconButton, Stack, ToolbarButton, useStyles2, Text, TextLink } from '@grafana/ui';

import { getHistoryStateManager } from './HistoryStateManager';
import { HistoryEntryApp } from './types';

export function HistoryDrawer() {
  const [isOpen, toggleIsOpen] = useToggle(false);

  return (
    <>
      <ToolbarButton icon="history-alt" tooltip="History" onClick={toggleIsOpen} />
      {isOpen && (
        <Drawer
          title="Grafana history"
          subtitle="A complete journal of your travels within Grafana"
          onClose={toggleIsOpen}
        >
          <HistoryItems />
        </Drawer>
      )}
    </>
  );
}

export function HistoryItems() {
  const styles = useStyles2(getStyles);
  const { entries } = getHistoryStateManager().useState();

  return (
    <div className={styles.container}>
      <div className={styles.heading}>History</div>
      <Stack direction="column" gap={0.5}>
        {entries.map((entry, index) => (
          <HistoryEntryAppView key={index} entry={entry} />
        ))}
      </Stack>
    </div>
  );
}

interface ItemProps {
  entry: HistoryEntryApp;
}

function HistoryEntryAppView({ entry }: ItemProps) {
  const styles = useStyles2(getStyles);
  const [isExpanded, setIsExpanded] = useState(true);
  const currentUrl = window.location.href;

  // Hack to filter out the current page
  const views = entry.views.filter((view) => view.url !== currentUrl);
  if (views.length === 0) {
    return null;
  }

  return (
    <Stack direction="column" gap={1}>
      <Stack>
        <IconButton
          name={isExpanded ? 'angle-up' : 'angle-down'}
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Expand / collapse"
          className={styles.iconButton}
        />
        <Text weight="medium">{entry.name}</Text>
      </Stack>
      {isExpanded && (
        <div className={styles.expanded}>
          {views.map((view, index) => (
            <div key={index}>
              <TextLink href={view.url} inline={false}>
                {view.name}
              </TextLink>
            </div>
          ))}
        </div>
      )}
    </Stack>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    container: css({
      display: 'flex',
      flexDirection: 'column',
    }),
    heading: css({
      display: 'none',
      fontWeight: theme.typography.fontWeightMedium,
      paddingBottom: theme.spacing(1),
    }),
    iconButton: css({
      margin: 0,
    }),
    expanded: css({
      display: 'flex',
      flexDirection: 'column',
      marginLeft: theme.spacing(3),
      gap: theme.spacing(1),
      position: 'relative',
      '&:before': {
        content: '""',
        position: 'absolute',
        left: theme.spacing(-2),
        top: 0,
        height: '100%',
        width: '1px',
        background: theme.colors.border.weak,
      },
    }),
  };
};
