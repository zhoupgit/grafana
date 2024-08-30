import { PluginPage } from '@grafana/runtime';
import {
  EmbeddedScene,
  PanelBuilders,
  SceneControlsSpacer,
  SceneFlexItem,
  SceneFlexLayout,
  SceneQueryRunner,
  SceneRefreshPicker,
  SceneTimePicker,
  SceneTimeRange,
  VariableValueSelectors,
} from '@grafana/scenes';

import { useMemo } from 'react';

const getScene = () => {
  const timeRange = new SceneTimeRange({
    from: 'now-6h',
    to: 'now',
  });

  const DATASOURCE_REF = {
    uid: 'gdev-testdata',
    type: 'testdata',
  };

  const queryRunner = new SceneQueryRunner({
    datasource: DATASOURCE_REF,
    queries: [
      {
        refId: 'A',
        datasource: DATASOURCE_REF,
        scenarioId: 'logs',
        lines: 100,
      },
    ],
    maxDataPoints: 100,
  });

  return new EmbeddedScene({
    $timeRange: timeRange,
    $data: queryRunner,
    body: new SceneFlexLayout({
      children: [
        new SceneFlexItem({
          minHeight: 300,
          body: PanelBuilders.logs().setTitle('Logs').build(),
        }),
      ],
    }),
    controls: [
      new SceneControlsSpacer(),
      new SceneTimePicker({ isOnCanvas: true }),
      new SceneRefreshPicker({
        intervals: ['5s', '1m', '1h'],
        isOnCanvas: true,
        refresh: 'auto',
      }),
    ],
  });
};

export function Logs() {
  const scene = useMemo(() => getScene(), []);

  return (
    <PluginPage>
      <scene.Component model={scene} />
    </PluginPage>
  );
}
