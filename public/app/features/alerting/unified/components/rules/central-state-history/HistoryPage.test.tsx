import { FieldType } from '@grafana/data';

import { historyResultToDataFrame } from './utils';

const time_0 = 1718368710000;
// time1 + 30 seg
const time_plus_30 = 1718368740000;
// time1 + 5 seg
const time_plus_5 = 1718368715000;
// time1 + 15 seg
const time_plus_15 = 1718368725000;
// time1 + 10 seg
const time_plus_10 = 1718368720000;

const getDataFrame = (times: number[]) => ({
  schema: {
    fields: [
      {
        name: 'time',
        type: FieldType.time,
        labels: {},
      },
      {
        name: 'line',
        type: FieldType.other,
        labels: {},
      },
      {
        name: 'labels',
        type: FieldType.other,
        labels: {},
      },
    ],
  },
  data: {
    values: [
      [...times],
      [
        {
          schemaVersion: 1,
          previous: 'Pending',
          current: 'Alerting',
          value: {
            A: 1,
            B: 1,
            C: 1,
          },
          condition: 'C',
          dashboardUID: '',
          panelID: 0,
          fingerprint: '141da2d491f61029',
          ruleTitle: 'multi-dimensional (copy)',
          ruleID: 7,
          ruleUID: 'adnpo0g62bg1sb',
          labels: {
            alertname: 'multi-dimensional (copy)',
            grafana_folder: 'FOLDER A',
            handler: '/alerting/*',
          },
        },
        {
          schemaVersion: 1,
          previous: 'Pending',
          current: 'Alerting',
          value: {
            A: 1,
            B: 1,
            C: 1,
          },
          condition: 'C',
          dashboardUID: '',
          panelID: 0,
          fingerprint: '141da2d491f61029',
          ruleTitle: 'multi-dimensional longlonglonglonglonglonglonglonglonglonglonglonglong',
          ruleID: 3,
          ruleUID: 'adna1xso80hdsd',
          labels: {
            alertname: 'multi-dimensional longlonglonglonglonglonglonglonglonglonglonglonglong',
            grafana_folder: 'FOLDER A',
            handler: '/alerting/*',
          },
        },
        {
          schemaVersion: 1,
          previous: 'Pending',
          current: 'Alerting',
          value: {
            A: 1,
            B: 1,
            C: 1,
          },
          condition: 'C',
          dashboardUID: '',
          panelID: 0,

          fingerprint: '141da2d491f61029',
          ruleTitle: 'multi-dimensional (copy)',
          ruleID: 7,
          ruleUID: 'adnpo0g62bg1sb',
          labels: {
            alertname: 'multi-dimensional (copy)',
            grafana_folder: 'FOLDER A',
            handler: '/alerting/*',
          },
        },
        {
          schemaVersion: 1,
          previous: 'Pending',
          current: 'Alerting',
          value: {
            A: 1,
            B: 1,
            C: 1,
          },
          condition: 'C',
          dashboardUID: '',
          panelID: 0,
          fingerprint: '5d438530c73fc657',
          ruleTitle: 'multi-dimensional longlonglonglonglonglonglonglonglonglonglonglonglong',
          ruleID: 3,
          ruleUID: 'adna1xso80hdsd',
          labels: {
            alertname: 'multi-dimensional longlonglonglonglonglonglonglonglonglonglonglonglong',
            grafana_folder: 'FOLDER A',
            handler: '/alerting/*',
          },
        },
      ],
      [
        {
          folderUID: 'edlvwh5881z40e',
          from: 'state-history',
          group: 'GROUP111',
          level: 'info',
          orgID: '1',
          service_name: 'unknown_service',
        },
        {
          folderUID: 'edlvwh5881z40e',
          from: 'state-history',
          group: 'GROUP111',
          level: 'info',
          orgID: '1',
          service_name: 'unknown_service',
        },
        {
          folderUID: 'edlvwh5881z40e',
          from: 'state-history',
          group: 'GROUP111',
          level: 'info',
          orgID: '1',
          service_name: 'unknown_service',
        },
        {
          folderUID: 'edlvwh5881z40e',
          from: 'state-history',
          group: 'GROUP111',
          level: 'info',
          orgID: '1',
          service_name: 'unknown_service',
        },
      ],
    ],
  },
});

describe('historyResultToDataFrame', () => {
  it('should return correct result grouping by 10 seconds', async () => {
    const result = historyResultToDataFrame(getDataFrame([time_0, time_0, time_plus_30, time_plus_30]));
    expect(result[0].length).toBe(2);
    expect(result[0].fields[0].name).toBe('time');
    expect(result[0].fields[1].name).toBe('value');
    expect(result[0].fields[0].values).toStrictEqual([time_0, time_plus_30]);
    expect(result[0].fields[1].values).toStrictEqual([2, 2]);

    const result2 = historyResultToDataFrame(getDataFrame([time_0, time_plus_5, time_plus_30, time_plus_30]));
    expect(result2[0].length).toBe(2);
    expect(result2[0].fields[0].name).toBe('time');
    expect(result2[0].fields[1].name).toBe('value');
    expect(result2[0].fields[0].values).toStrictEqual([time_0, time_plus_30]);
    expect(result2[0].fields[1].values).toStrictEqual([2, 2]);

    const result3 = historyResultToDataFrame(getDataFrame([time_0, time_plus_15, time_plus_10, time_plus_30]));
    expect(result3[0].length).toBe(3);
    expect(result3[0].fields[0].name).toBe('time');
    expect(result3[0].fields[1].name).toBe('value');
    expect(result3[0].fields[0].values).toStrictEqual([time_0, time_plus_10, time_plus_30]);
    expect(result3[0].fields[1].values).toStrictEqual([1, 2, 1]);
  });
});
