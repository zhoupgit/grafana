import React from 'react';
import { useToggle } from 'react-use';

import { CombinedRuleGroup } from 'app/types/unified-alerting';

import EvaluationGroup from './EvaluationGroup';
import { RulesList } from './List';

export interface EvaluationGroupWithRulesProps {
  group: CombinedRuleGroup;
}

export const EvaluationGroupWithRules = ({ group }: EvaluationGroupWithRulesProps) => {
  const [open, toggleOpen] = useToggle(false);

  return (
    <EvaluationGroup name={group.name} interval={group.interval} isOpen={open} onToggle={toggleOpen}>
      <RulesList rules={group.rules} />
    </EvaluationGroup>
  );
};
