import { css } from '@emotion/css';
import { filter } from 'lodash';
import { useCallback, useMemo, useState, type FocusEvent } from 'react';
import { useForm } from 'react-hook-form';

import { DataSourceInstanceSettings, GrafanaTheme2 } from '@grafana/data';
import {
  Badge,
  Button,
  Grid,
  IconButton,
  Input,
  InteractiveTable,
  Label,
  RadioButtonGroup,
  Select,
  Stack,
  Tab,
  TabsBar,
  useStyles2,
} from '@grafana/ui';
import { RuleHealth } from 'app/types/unified-alerting';
import { PromAlertingRuleState } from 'app/types/unified-alerting-dto';

import { useRulesFilter } from '../../../hooks/useFilteredRules';
import { useURLSearchParams } from '../../../hooks/useURLSearchParams';
import { PopupCard } from '../../HoverCard';
import MoreButton from '../../MoreButton';
import { MultipleDataSourcePicker } from '../MultipleDataSourcePicker';

import {
  ViewOptions,
  RuleHealthOptions,
  RuleTypeOptions,
  RuleStateOptions,
  PluginOptions,
  WithAnyOption,
} from './Options';
import { usePluginsFilterStatus } from './RulesFilter.v1';

type RulesFilterProps = {
  onClear?: () => void;
};

type ActiveTab = 'custom' | 'saved';

interface FormValues {
  namespace?: string;
  group?: string;
  name?: string;
  labels: string[];
  dataSource: string[];
  state: WithAnyOption<PromAlertingRuleState>;
  type: WithAnyOption<'alerting' | 'recording'>;
  health: WithAnyOption<RuleHealth>;
  dashboardUID?: string;
  plugins?: 'hide'; // @TODO support selecting one or more plugin sources to filter by
}

export default function RulesFilter({ onClear = () => {} }: RulesFilterProps) {
  const styles = useStyles2(getStyles);
  const { searchQuery } = useRulesFilter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('custom');
  const [queryParams, updateQueryParams] = useURLSearchParams();

  const filterOptions = useMemo(() => {
    return (
      <PopupCard
        showOn="click"
        placement="bottom-start"
        content={
          <div className={styles.content}>
            {activeTab === 'custom' && <FilterOptions />}
            {activeTab === 'saved' && <SavedSearches />}
          </div>
        }
        header={
          <TabsBar hideBorder className={styles.fixTabsMargin}>
            <Tab
              active={activeTab === 'custom'}
              icon="filter"
              label={'Custom filter'}
              onChangeTab={() => setActiveTab('custom')}
            />
            <Tab
              active={activeTab === 'saved'}
              icon="bookmark"
              label={'Saved searches'}
              onChangeTab={() => setActiveTab('saved')}
            />
          </TabsBar>
        }
      >
        <IconButton name="filter" aria-label="Show filters" />
      </PopupCard>
    );
  }, [activeTab, styles.content, styles.fixTabsMargin]);

  return (
    <form>
      <Stack direction="row" alignItems="end">
        <Stack direction="column" gap={0} flex={1}>
          <Label>Search</Label>
          <Input prefix={filterOptions} defaultValue={searchQuery} />
        </Stack>
        <Button type="submit" variant="secondary">
          Search
        </Button>
        <Stack direction="column" gap={0}>
          <Label>View as</Label>
          <RadioButtonGroup
            options={ViewOptions}
            value={queryParams.get('view') ?? ViewOptions[0].value}
            onChange={(view: string) => updateQueryParams({ view })}
          />
        </Stack>
      </Stack>
    </form>
  );
}

const FilterOptions = () => {
  const { pluginsFilterEnabled } = usePluginsFilterStatus();
  const { updateFilters, filterState } = useRulesFilter();
  const { register, handleSubmit, setValue, reset, resetField, watch, getValues } = useForm<FormValues>({
    defaultValues: {
      state: filterState.ruleState ?? '*',
      type: filterState.ruleType ?? '*',
      health: filterState.ruleHealth ?? '*',
      plugins: filterState.plugins ?? 'hide',
      dataSource: filterState.dataSourceNames ?? [],
      labels: filterState.labels ?? [],
    },
  });

  const onSubmit = (values: FormValues) => {
    updateFilters({
      groupName: values.group,
      namespace: values.namespace,
      dataSourceNames: values.dataSource,
      freeFormWords: [],
      labels: [],
      ruleName: values.name,
      dashboardUid: values.dashboardUID,
      plugins: values.plugins,
      ruleState: anyValueToUndefined(values.state),
      ruleHealth: anyValueToUndefined(values.health),
      ruleType: anyValueToUndefined(values.type),
    });
  };

  const handleDataSourceChange = (dataSourceValue: DataSourceInstanceSettings, action: 'add' | 'remove') => {
    if (action === 'add') {
      const existingValue = getValues('dataSource') ?? [];
      setValue('dataSource', existingValue.concat(dataSourceValue.name));
    } else if (action === 'remove') {
      const existingValue = getValues('dataSource') ?? [];
      setValue('dataSource', filter(existingValue, dataSourceValue.name));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="column" alignItems="end" gap={2}>
        <Grid columns={2} gap={2} alignItems="center">
          <Label>Folder / Namespace</Label>
          <Select {...register('namespace')} options={[]} onBlur={stopPropagation} />
          <Label>Rule name</Label>
          <Input {...register('name')} onBlur={stopPropagation} />
          <Label>Evaluation group</Label>
          <Input {...register('group')} onBlur={stopPropagation} />
          <Label>Labels</Label>
          <Input {...register('labels')} onBlur={stopPropagation} />
          <Label>Data source</Label>
          <MultipleDataSourcePicker
            alerting
            noDefault
            placeholder="All data sources"
            current={watch('dataSource')}
            onChange={handleDataSourceChange}
            onClear={() => resetField('dataSource')}
            onBlur={stopPropagation}
          />
          <Label>Dashboard</Label>
          <Select {...register('dashboardUID')} options={[]} onBlur={stopPropagation} />
          {pluginsFilterEnabled && (
            <div>
              <Label>From plugin</Label>
              <RadioButtonGroup
                options={PluginOptions}
                {...register('plugins')}
                value={watch('plugins')}
                onChange={(value) => {
                  setValue('plugins', value);
                }}
              />
            </div>
          )}
          <Label>State</Label>
          <RadioButtonGroup
            options={RuleStateOptions}
            {...register('state')}
            value={watch('state')}
            onChange={(value) => {
              setValue('state', value);
            }}
          />
          <Label>Type</Label>
          <RadioButtonGroup
            options={RuleTypeOptions}
            {...register('type')}
            value={watch('type')}
            onChange={(value) => {
              setValue('type', value);
            }}
          />
          <Label>Health</Label>
          <RadioButtonGroup
            options={RuleHealthOptions}
            {...register('health')}
            value={watch('health')}
            onChange={(value) => {
              setValue('health', value);
            }}
          />
        </Grid>
        <Stack direction="row" alignItems="center">
          <Button variant="secondary" onClick={() => reset()}>
            Clear
          </Button>
          <Button type="submit">Apply</Button>
        </Stack>
      </Stack>
    </form>
  );
};

type TableColumns = {
  name: string;
  default?: boolean;
};

const SavedSearches = () => {
  const applySearch = useCallback((name: string) => {}, []);

  return (
    <>
      <Stack direction="column" gap={2} alignItems="flex-end">
        <Button variant="secondary" size="sm">
          Save current search
        </Button>
        <InteractiveTable<TableColumns>
          columns={[
            {
              id: 'name',
              header: 'Saved search name',
              cell: ({ row }) => (
                <Stack alignItems="center">
                  {row.original.name}
                  {row.original.default ? <Badge text="Default" color="blue" /> : null}
                </Stack>
              ),
            },
            {
              id: 'actions',
              cell: ({ row }) => (
                <Stack direction="row" alignItems="center">
                  <Button variant="secondary" fill="outline" size="sm" onClick={() => applySearch(row.original.name)}>
                    Apply
                  </Button>
                  <MoreButton size="sm" fill="outline" />
                </Stack>
              ),
            },
          ]}
          data={[
            {
              name: 'My saved search',
              default: true,
            },
            {
              name: 'Another saved search',
            },
            {
              name: 'This one has a really long name and some emojis too 🥒',
            },
          ]}
          getRowId={(row) => row.name}
        />
        <Button variant="secondary">Close</Button>
      </Stack>
    </>
  );
};

function getStyles(theme: GrafanaTheme2) {
  return {
    content: css({
      padding: theme.spacing(1),
      maxWidth: 500,
    }),
    fixTabsMargin: css({
      marginTop: theme.spacing(-1),
    }),
  };
}

function anyValueToUndefined<T extends string>(input: T): Omit<T, '*'> | undefined {
  return String(input) === '*' ? undefined : input;
}

// we'll need this util function to prevent onBlur of the inputs to trigger closing the interactive card
function stopPropagation(e: FocusEvent) {
  e.stopPropagation();
}
