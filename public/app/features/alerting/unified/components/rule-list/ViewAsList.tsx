import { css } from '@emotion/css';
import equal from 'fast-deep-equal';
import React, { useCallback } from 'react';

import type { GrafanaTheme2 } from '@grafana/data';
import { Button, ButtonVariant, Stack, useStyles2 } from '@grafana/ui';
import type { CombinedRuleNamespace } from 'app/types/unified-alerting';
import { PromAlertingRuleState, PromRuleType } from 'app/types/unified-alerting-dto';

import { useRulesFilter } from '../../hooks/useFilteredRules';
import { RuleHealth, RulesFilter } from '../../search/rulesSearchParser';
import { Spacer } from '../Spacer';

import { RulesList } from './List';

interface Props {
  namespaces: CombinedRuleNamespace[];
}

// @TODO the "role=treeitem" will be wrong for the alert rule list item – should figure that out
const ViewAsList = ({ namespaces }: Props) => {
  const styles = useStyles2(getStyles);
  const { filterState, updateFilters } = useRulesFilter();

  const rules = namespaces.flatMap((namespace) => namespace.groups.flatMap((group) => group.rules));

  const isActive = useCallback(
    (filter: Partial<RulesFilter>) => {
      const stateEntries = Object.entries(filterState);
      return Object.entries(filter).every((filter) => stateEntries.some((entry) => equal(entry, filter)));
    },
    [filterState]
  );

  const tabProps = (filter: Partial<RulesFilter>) => {
    const variant: ButtonVariant = isActive(filter) ? 'primary' : 'secondary';

    return {
      onClick: () => updateFilters(filter),
      variant,
    };
  };

  return (
    <div className={styles.listWrapper}>
      <div className={styles.header}>
        <Stack direction="row">
          <Button
            icon="exclamation-circle"
            size="sm"
            {...tabProps({ ruleState: PromAlertingRuleState.Firing, ruleHealth: RuleHealth.Ok })}
            fill="text"
          >
            Firing rules
          </Button>
          <Button
            icon="check-circle"
            size="sm"
            {...tabProps({ ruleState: PromAlertingRuleState.Inactive, ruleHealth: RuleHealth.Ok })}
            fill="text"
          >
            Normal rules
          </Button>
          <Button
            icon="circle"
            size="sm"
            fill="text"
            {...tabProps({ ruleState: PromAlertingRuleState.Pending, ruleHealth: RuleHealth.Ok })}
          >
            Pending rules
          </Button>
          {/* we don't have a filter for paused yet */}
          <Button icon="pause-circle" size="sm" variant="secondary" fill="text">
            Paused rules
          </Button>
          <Button icon="times-circle" size="sm" fill="text" {...tabProps({ ruleHealth: RuleHealth.Error })}>
            Errored rules
          </Button>
          <Button icon="record-audio" size="sm" {...tabProps({ ruleType: PromRuleType.Recording })} fill="text">
            Recording rules
          </Button>
          <Spacer />
          <Button icon="angle-down" size="sm" variant="secondary" fill="text">
            Sort
          </Button>
        </Stack>
      </div>
      <ul className={styles.rulesTree} aria-label="List of alert rules">
        <RulesList rules={rules} withLocation={true} />
      </ul>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  header: css({
    borderBottom: `1px solid ${theme.colors.border.medium}`,
    background: theme.colors.background.secondary,
    padding: theme.spacing(1),
  }),
  rulesTree: css({
    display: 'flex',
    flexDirection: 'column',
  }),
  listWrapper: css({
    border: `1px solid ${theme.colors.border.medium}`,
    borderRadius: theme.shape.radius.default,
  }),
});

export default ViewAsList;
