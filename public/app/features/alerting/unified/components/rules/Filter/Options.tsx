import { SelectableValue } from '@grafana/data';
import { PromAlertingRuleState, PromRuleType } from 'app/types/unified-alerting-dto';

import { RuleHealth } from '../../../search/rulesSearchParser';

export const AllValue = '*';
export type WithAnyOption<T> = T | '*';

export const ViewOptions: SelectableValue[] = [
  {
    icon: 'folder',
    label: 'Grouped',
    value: 'grouped',
  },
  {
    icon: 'list-ul',
    label: 'List',
    value: 'list',
  },
  {
    icon: 'heart-rate',
    label: 'State',
    value: 'state',
  },
];

export const RuleTypeOptions: Array<SelectableValue<WithAnyOption<PromRuleType>>> = [
  {
    label: 'All',
    value: '*',
  },
  {
    label: 'Alert rule',
    value: PromRuleType.Alerting,
  },
  {
    label: 'Recording rule',
    value: PromRuleType.Recording,
  },
];

export const RuleHealthOptions: Array<SelectableValue<WithAnyOption<RuleHealth>>> = [
  { label: 'All', value: '*' },
  { label: 'Ok', value: RuleHealth.Ok },
  { label: 'No Data', value: RuleHealth.NoData },
  { label: 'Error', value: RuleHealth.Error },
];

export const RuleStateOptions: Array<SelectableValue<WithAnyOption<PromAlertingRuleState>>> = [
  { label: 'All', value: '*' },
  { label: 'Normal', value: PromAlertingRuleState.Inactive },
  { label: 'Pending', value: PromAlertingRuleState.Pending },
  { label: 'Firing', value: PromAlertingRuleState.Firing },
];

export const PluginOptions: Array<SelectableValue<'hide' | undefined>> = [
  { label: 'Show', value: undefined },
  { label: 'Hide', value: 'hide' },
];
