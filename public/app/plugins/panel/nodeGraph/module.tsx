import { LayerDirectionEnum } from '@msagl/core';
import { PanelPlugin } from '@grafana/data';

import { NodeGraphPanel } from './NodeGraphPanel';
import { ArcOptionsEditor } from './editor/ArcOptionsEditor';
import { NodeGraphSuggestionsSupplier } from './suggestions';
import { NodeGraphOptions } from './types';

export const plugin = new PanelPlugin<NodeGraphOptions>(NodeGraphPanel)
  .setPanelOptions((builder, context) => {
    builder.addNestedOptions({
      category: ['Graph'],
      path: 'graph',
      build: (builder) => {
        builder.addSelect({
          path: 'layerDirection',
          name: 'Layer direction',
          settings: {
            options: [
              { value: LayerDirectionEnum.TB, label: 'Top to bottom' },
              { value: LayerDirectionEnum.LR, label: 'Left to right' },
              { value: LayerDirectionEnum.BT, label: 'Bottom to top' },
              { value: LayerDirectionEnum.RL, label: 'Right to left' },
            ],
          },
          defaultValue: LayerDirectionEnum.LR,
        });
      },
    });
    builder.addNestedOptions({
      category: ['Nodes'],
      path: 'nodes',
      build: (builder) => {
        builder.addUnitPicker({
          name: 'Main stat unit',
          path: 'mainStatUnit',
        });
        builder.addUnitPicker({
          name: 'Secondary stat unit',
          path: 'secondaryStatUnit',
        });
        builder.addCustomEditor({
          name: 'Arc sections',
          path: 'arcs',
          id: 'arcs',
          editor: ArcOptionsEditor,
        });
      },
    });
    builder.addNestedOptions({
      category: ['Edges'],
      path: 'edges',
      build: (builder) => {
        builder.addUnitPicker({
          name: 'Main stat unit',
          path: 'mainStatUnit',
        });
        builder.addUnitPicker({
          name: 'Secondary stat unit',
          path: 'secondaryStatUnit',
        });
      },
    });
  })
  .setSuggestionsSupplier(new NodeGraphSuggestionsSupplier());
