import { groupBy } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { Observable, map } from 'rxjs';

import {
  DataFrame,
  Field as DataFrameField,
  DataFrameJSON,
  DataQuery,
  DataQueryRequest,
  DataQueryResponse,
  Field,
  FieldType,
  TestDataSourceResponse,
} from '@grafana/data';
import { fieldIndexComparer } from '@grafana/data/src/field/fieldComparers';
import { FetchResponse, getBackendSrv } from '@grafana/runtime';
import {
  EmbeddedScene,
  PanelBuilders,
  RuntimeDataSource,
  SceneControlsSpacer,
  SceneFlexItem,
  SceneFlexLayout,
  SceneQueryRunner,
  SceneRefreshPicker,
  SceneTimePicker,
  SceneTimeRange,
  SceneVariableSet,
  TextBoxVariable,
  VariableValueSelectors,
  sceneUtils,
} from '@grafana/scenes';
import { GraphDrawStyle, VisibilityMode } from '@grafana/schema/dist/esm/index';
import {
  GraphGradientMode,
  LegendDisplayMode,
  LineInterpolation,
  ScaleDistribution,
  StackingMode,
  TooltipDisplayMode,
} from '@grafana/ui';

import { DataSourceInformation } from '../../../home/Insights';
import { labelsMatchMatchers, parseMatchers } from '../../../utils/alertmanager';
import { LogRecord } from '../state-history/common';
import { isLine, isNumbers } from '../state-history/useRuleHistoryRecords';

import { HistoryEventsListObject, LIMIT_EVENTS } from './CentralAlertHistory';

const historyDataSourceUid = '__history_api_ds__';
const historyDataSourcePluginId = '__history_api_ds__';
const GROUPING_INTERVAL = 10 * 1000; // 10 seconds
const QUERY_PARAM_PREFIX = 'var-';
export const LABELS_FILTER = 'filter';

export const CentralAlertHistoryScene = () => {
  const ashDs: DataSourceInformation = {
    type: historyDataSourcePluginId,
    uid: historyDataSourceUid,
    settings: undefined,
  };

  // we need to memoize the datasource so it is not registered multiple times for each render
  const ds = useMemo(() => new HistoryAPIDatasource(historyDataSourcePluginId, historyDataSourceUid), []);
  useEffect(() => {
    sceneUtils.registerRuntimeDataSource({ dataSource: ds });
  }, [ds]);
  const filterVariable = new TextBoxVariable({
    name: LABELS_FILTER,
    label: 'Filter events',
    description: 'Filter events in the list with labels',
    skipUrlSync: false,
  });

  const scene = new EmbeddedScene({
    controls: [
      new VariableValueSelectors({}),
      new SceneControlsSpacer(),
      new SceneTimePicker({}),
      new SceneRefreshPicker({}),
    ],
    $timeRange: new SceneTimeRange({}), //needed for using the time range sync in the url
    $variables: new SceneVariableSet({
      variables: [filterVariable],
    }),
    body: new SceneFlexLayout({
      direction: 'column',
      children: [
        new SceneFlexItem({
          ySizing: 'content',
          body: getEventsSceneObject(ashDs),
        }),
        new SceneFlexItem({
          body: new HistoryEventsListObject(),
        }),
      ],
    }),
  });
  scene.initUrlSync(); // we need to call this to sync the url with the scene state

  return <scene.Component model={scene} />;
};

function getEventsSceneObject(ashDs: DataSourceInformation) {
  return new EmbeddedScene({
    controls: [],
    body: new SceneFlexLayout({
      direction: 'column',
      children: [
        new SceneFlexItem({
          ySizing: 'content',
          body: new SceneFlexLayout({
            children: [getEventsScenesFlexItem(ashDs)],
          }),
        }),
      ],
    }),
  });
}
/**
 * This function creates a SceneFlexItem with a timeseries panel that shows the events.
 * The query uses a runtime datasource that fetches the events from the history api.
 */
export function getEventsScenesFlexItem(datasource: DataSourceInformation) {
  const query = new SceneQueryRunner({
    datasource: datasource,
    queries: [
      {
        refId: 'A',
        expr: '',
        queryType: 'range',
        step: '10s',
      },
    ],
  });

  return new SceneFlexItem({
    minHeight: 300,
    body: PanelBuilders.timeseries()
      .setTitle('Events')
      .setDescription('Alert events during the period of time.')
      .setData(query)
      .setColor({ mode: 'continuous-BlPu' })
      .setCustomFieldConfig('fillOpacity', 100)
      .setCustomFieldConfig('drawStyle', GraphDrawStyle.Bars)
      .setCustomFieldConfig('lineInterpolation', LineInterpolation.Linear)
      .setCustomFieldConfig('lineWidth', 1)
      .setCustomFieldConfig('barAlignment', 0)
      .setCustomFieldConfig('spanNulls', false)
      .setCustomFieldConfig('insertNulls', false)
      .setCustomFieldConfig('showPoints', VisibilityMode.Auto)
      .setCustomFieldConfig('pointSize', 5)
      .setCustomFieldConfig('stacking', { mode: StackingMode.None, group: 'A' })
      .setCustomFieldConfig('gradientMode', GraphGradientMode.Hue)
      .setCustomFieldConfig('scaleDistribution', { type: ScaleDistribution.Linear })
      .setOption('legend', { showLegend: false, displayMode: LegendDisplayMode.Hidden })
      .setOption('tooltip', { mode: TooltipDisplayMode.Single })

      .setNoValue('No events found')
      .build(),
  });
}

/**
 * This class is a runtime datasource that fetches the events from the history api.
 * The events are grouped by alert instance and then converted to a DataFrame list.
 * The DataFrame list is then grouped by time.
 * This allows us to filter the events by labels.
 * The result is a timeseries panel that shows the events for the selected time range and filtered by labels.
 */
class HistoryAPIDatasource extends RuntimeDataSource {
  constructor(pluginId: string, uid: string) {
    super(uid, pluginId);
  }

  query(request: DataQueryRequest<DataQuery>): Promise<DataQueryResponse> | Observable<DataQueryResponse> {
    const from = request.range.from.unix();
    const to = request.range.to.unix();
    return getHistory(from, to);
  }

  testDatasource(): Promise<TestDataSourceResponse> {
    return Promise.resolve({ status: 'success', message: 'Data source is working', title: 'Success' });
  }
}

export const getHistory = (from: number, to: number): Observable<DataQueryResponse> => {
  return getBackendSrv()
    .fetch<DataFrameJSON>({
      url: `/api/v1/rules/history`,
      params: { limit: LIMIT_EVENTS, from, to },
      method: 'GET',
    })
    .pipe(
      map((res: FetchResponse<DataFrameJSON>) => {
        return {
          ...res,
          data: historyResultToDataFrame(res.data),
        };
      })
    );
};

/*
 * This function is used to convert the history response to a DataFrame list.
 * The response is a list of log records, each log record has a timestamp and a line.
 * We group all records by alert instance (unique set of labels) and create a DataFrame for each group (instance).
 * This allows us to be able to filter by labels in the groupDataFramesByTime function.
 */
function historyResultToDataFrame(data: DataFrameJSON): DataFrame[] {
  // merge timestamp with "line"
  const tsValues = data?.data?.values[0] ?? [];
  const timestamps: number[] = isNumbers(tsValues) ? tsValues : [];
  const lines = data?.data?.values[1] ?? [];

  const logRecords = timestamps.reduce((acc: LogRecord[], timestamp: number, index: number) => {
    const line = lines[index];
    // values property can be undefined for some instance states (e.g. NoData)
    if (isLine(line)) {
      acc.push({ timestamp, line });
    }
    return acc;
  }, []);

  // Group log records by alert instance
  const logRecordsByInstance = groupBy(logRecords, (record: LogRecord) => {
    return JSON.stringify(record.line.labels);
  });

  // Convert each group of log records to a DataFrame
  const dataFrames: DataFrame[] = Object.entries(logRecordsByInstance).map<DataFrame>(([key, records]) => {
    // key is the stringified labels
    return logRecordsToDataFrame(key, records);
  });

  // Group DataFrames by time
  return groupDataFramesByTime(dataFrames);
}

// Scenes sync variables in the URL adding a prefix to the variable name.
function getFilterInQueryParams() {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get(`${QUERY_PARAM_PREFIX}${LABELS_FILTER}`) ?? '';
}

/*
 * This function groups the data frames by time.
 * The interval is set to 10 seconds.
 * */
function groupDataFramesByTime(dataFrames: DataFrame[]): DataFrame[] {
  // Filter data frames by labels. This is used to filter out the data frames that do not match the query.
  const filterValue = getFilterInQueryParams();
  const dataframesFiltered = dataFrames.filter((frame) => {
    const labels = JSON.parse(frame.name ?? ''); // in name we store the labels stringified
    const matchers = Boolean(filterValue) ? parseMatchers(filterValue) : [];
    return labelsMatchMatchers(labels, matchers);
  });
  // Extract time fields from filtered data frames
  const timeFieldList = dataframesFiltered.flatMap((frame) => frame.fields.find((field) => field.name === 'time'));

  // Group time fields by interval
  const groupedTimeFields = groupBy(
    timeFieldList?.flatMap((tf) => tf?.values),
    (time: number) => Math.floor(time / GROUPING_INTERVAL) * GROUPING_INTERVAL
  );

  // Create new time field with grouped time values
  const newTimeField: Field = {
    name: 'time',
    type: FieldType.time,
    values: Object.keys(groupedTimeFields).map(Number),
    config: { displayName: 'Time', custom: { fillOpacity: 100 } },
  };

  // Create count field with count of records in each group
  const countField: Field = {
    name: 'value',
    type: FieldType.number,
    values: Object.values(groupedTimeFields).map((group) => group.length),
    config: {},
  };

  // Return new DataFrame with time and count fields
  return [
    {
      fields: [newTimeField, countField],
      length: newTimeField.values.length,
    },
  ];
}

/*
 * This function is used to convert the log records to a DataFrame.
 * The DataFrame has two fields: time and value.
 * The time field is the timestamp of the log record.
 * The value field is always 1.
 * */
function logRecordsToDataFrame(instanceLabels: string, records: LogRecord[]): DataFrame {
  const timeField: DataFrameField = {
    name: 'time',
    type: FieldType.time,
    values: [...records.map((record) => record.timestamp)],
    config: { displayName: 'Time', custom: { fillOpacity: 100 } },
  };

  // Sort time field values
  const timeIndex = timeField.values.map((_, index) => index);
  timeIndex.sort(fieldIndexComparer(timeField));

  // Create DataFrame with time and value fields
  const frame: DataFrame = {
    fields: [
      {
        ...timeField,
        values: timeField.values.map((_, i) => timeField.values[timeIndex[i]]),
      },
      {
        name: instanceLabels,
        type: FieldType.number,
        values: timeField.values.map((record) => 1),
        config: {},
      },
    ],
    length: timeField.values.length,
    name: instanceLabels,
  };

  return frame;
}
