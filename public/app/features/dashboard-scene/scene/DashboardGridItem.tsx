import { css } from '@emotion/css';
import React, { useMemo } from 'react';
import { Unsubscribable } from 'rxjs';
import { LibraryPanel } from '@grafana/schema';

import { config } from '@grafana/runtime';
import {
  VizPanel,
  SceneObjectBase,
  VariableDependencyConfig,
  SceneGridLayout,
  SceneVariableSet,
  SceneComponentProps,
  SceneGridItemStateLike,
  SceneGridItemLike,
  sceneGraph,
  MultiValueVariable,
  LocalValueVariable,
  CustomVariable,
  VizPanelMenu,
  VizPanelState,
} from '@grafana/scenes';
import { GRID_CELL_HEIGHT, GRID_CELL_VMARGIN } from 'app/core/constants';

import { getMultiVariableValues, getPanelIdForVizPanel, getVizPanelKeyForPanelId } from '../utils/utils';

import { AddLibraryPanelDrawer } from './AddLibraryPanelDrawer';
import { LibraryVizPanel } from './LibraryVizPanel';
import { panelLinksBehavior, panelMenuBehavior, repeatPanelMenuBehavior } from './PanelMenuBehavior';
import { DashboardRepeatsProcessedEvent } from './types';
import { PanelModel } from 'app/features/dashboard/state';
import { createPanelDataProvider } from '../utils/createPanelDataProvider';
import { VizPanelLinks, VizPanelLinksMenu } from './PanelLinks';
import { PanelNotices } from './PanelNotices';
import { getLibraryPanel } from 'app/features/library-panels/state/api';

export interface LibraryPanelMeta {
  uid?: string;
  name?: string;
  isLoaded?: boolean;
  _loadedPanel?: LibraryPanel;
}

interface DashboardGridItemState extends SceneGridItemStateLike {
  body: VizPanel | LibraryVizPanel | AddLibraryPanelDrawer;
  repeatedPanels?: VizPanel[];
  variableName?: string;
  itemHeight?: number;
  repeatDirection?: RepeatDirection;
  maxPerRow?: number;
  libraryPanel?: LibraryPanelMeta;
}

export type RepeatDirection = 'v' | 'h';

export class DashboardGridItem extends SceneObjectBase<DashboardGridItemState> implements SceneGridItemLike {
  private _libPanelSubscription: Unsubscribable | undefined;
  protected _variableDependency = new VariableDependencyConfig(this, {
    variableNames: this.state.variableName ? [this.state.variableName] : [],
    onVariableUpdateCompleted: this._onVariableUpdateCompleted.bind(this),
  });

  public constructor(state: DashboardGridItemState) {
    super(state);

    this.addActivationHandler(() => this._activationHandler());
  }

  private _activationHandler() {
    if (this.state.variableName) {
      this._subs.add(this.subscribeToState((newState, prevState) => this._handleGridResize(newState, prevState)));
      this._performRepeat();
    }

    if (this.state.libraryPanel && !this.state.libraryPanel?.isLoaded) {
      this.loadLibraryPanelFromPanelModel();
      this.setupLibraryPanelChangeSubscription(this.state.body as VizPanel, this.state.libraryPanel);
    }

    // Subscriptions that handles body updates, i.e. VizPanel -> LibraryVizPanel, AddLibPanelWidget -> LibraryVizPanel
    this._subs.add(
      this.subscribeToState((newState, prevState) => {
        if (newState.body !== prevState.body) {
          console.log(newState)
          if (newState.libraryPanel) {
            this.setupLibraryPanelChangeSubscription(newState.body as VizPanel, newState.libraryPanel);
          }
        }
      })
    );

    return () => {
      this._libPanelSubscription?.unsubscribe();
      this._libPanelSubscription = undefined;
    };
  }

  private setupLibraryPanelChangeSubscription(panel: VizPanel, libraryPanel: LibraryPanelMeta) {
    if (this._libPanelSubscription) {
      this._libPanelSubscription.unsubscribe();
      this._libPanelSubscription = undefined;
    }

    this._libPanelSubscription = panel.subscribeToState((newState) => {
      console.log("libPanelSub", libraryPanel)
      this.setState({
        libraryPanel
      })

      if (libraryPanel._loadedPanel?.model.repeat) {
        this._variableDependency.setVariableNames([libraryPanel._loadedPanel.model.repeat]);
        this.setState({
          variableName: libraryPanel._loadedPanel.model.repeat,
          repeatDirection: libraryPanel._loadedPanel.model.repeatDirection,
          maxPerRow: libraryPanel._loadedPanel.model.maxPerRow,
        });
        this._performRepeat();
      }
    });
  }

  private _onVariableUpdateCompleted(): void {
    if (this.state.variableName) {
      this._performRepeat();
    }
  }

  public setPanelFromLibPanel(libPanel: LibraryPanel) {
    if (this.state.libraryPanel!._loadedPanel?.version === libPanel.version) {
      return;
    }

    const libPanelModel = new PanelModel(libPanel.model);

    const panelId = getPanelIdForVizPanel(this.state.body);

    const vizPanelState: VizPanelState = {
      title: libPanelModel.title,
      key: getVizPanelKeyForPanelId(panelId),
      options: libPanelModel.options ?? {},
      fieldConfig: libPanelModel.fieldConfig,
      pluginId: libPanelModel.type,
      pluginVersion: libPanelModel.pluginVersion,
      displayMode: libPanelModel.transparent ? 'transparent' : undefined,
      description: libPanelModel.description,
      $data: createPanelDataProvider(libPanelModel),
      menu: new VizPanelMenu({ $behaviors: [panelMenuBehavior] }),
      titleItems: [
        new VizPanelLinks({
          rawLinks: libPanelModel.links,
          menu: new VizPanelLinksMenu({ $behaviors: [panelLinksBehavior] }),
        }),
        new PanelNotices(),
      ],
    };

    const panel = new VizPanel(vizPanelState);

    this.setState({ 
      body: panel,
      libraryPanel: { uid: libPanel.uid,  _loadedPanel: libPanel, isLoaded: true, name: libPanel.name }
    });
  }

  private async loadLibraryPanelFromPanelModel() {
    let vizPanel = this.state.body;

    try {
      const libPanel = await getLibraryPanel(this.state.libraryPanel!.uid!, true);
      this.setPanelFromLibPanel(libPanel);
      if (this.parent instanceof DashboardGridItem) {
        this.parent.setState({
          variableName: libPanel.model.repeat,
          repeatDirection: libPanel.model.repeatDirection === 'h' ? 'h' : 'v',
          maxPerRow: libPanel.model.maxPerRow,
        });
      }
    } catch (err) {
      vizPanel.setState({
        _pluginLoadError: `Unable to load library panel: ${this.state.libraryPanel!.uid}`,
      });
    }
  }

  /**
   * Uses the current repeat item count to calculate the user intended desired itemHeight
   */
  private _handleGridResize(newState: DashboardGridItemState, prevState: DashboardGridItemState) {
    const itemCount = this.state.repeatedPanels?.length ?? 1;
    const stateChange: Partial<DashboardGridItemState> = {};

    // Height changed
    if (newState.height === prevState.height) {
      return;
    }

    if (this.getRepeatDirection() === 'v') {
      const itemHeight = Math.ceil(newState.height! / itemCount);
      stateChange.itemHeight = itemHeight;
    } else {
      const rowCount = Math.ceil(itemCount / this.getMaxPerRow());
      stateChange.itemHeight = Math.ceil(newState.height! / rowCount);
    }

    if (stateChange.itemHeight !== this.state.itemHeight) {
      this.setState(stateChange);
    }
  }

  private _performRepeat() {
    if (this.state.body instanceof AddLibraryPanelDrawer) {
      return;
    }
    if (!this.state.variableName || this._variableDependency.hasDependencyInLoadingState()) {
      return;
    }

    const variable =
      sceneGraph.lookupVariable(this.state.variableName, this) ??
      new CustomVariable({
        name: '_____default_sys_repeat_var_____',
        options: [],
        value: '',
        text: '',
        query: 'A',
      });

    if (!(variable instanceof MultiValueVariable)) {
      console.error('DashboardGridItem: Variable is not a MultiValueVariable');
      return;
    }

    let panelToRepeat = this.state.body instanceof LibraryVizPanel ? this.state.body.state.panel! : this.state.body;
    const { values, texts } = getMultiVariableValues(variable);
    const repeatedPanels: VizPanel[] = [];

    // Loop through variable values and create repeats
    for (let index = 0; index < values.length; index++) {
      const cloneState: Partial<VizPanelState> = {
        $variables: new SceneVariableSet({
          variables: [
            new LocalValueVariable({ name: variable.state.name, value: values[index], text: String(texts[index]) }),
          ],
        }),
        key: `${panelToRepeat.state.key}-clone-${index}`,
      };
      if (index > 0) {
        cloneState.menu = new VizPanelMenu({
          $behaviors: [repeatPanelMenuBehavior],
        });
      }
      const clone = panelToRepeat.clone(cloneState);
      repeatedPanels.push(clone);
    }

    const direction = this.getRepeatDirection();
    const stateChange: Partial<DashboardGridItemState> = { repeatedPanels: repeatedPanels };
    const itemHeight = this.state.itemHeight ?? 10;
    const prevHeight = this.state.height;
    const maxPerRow = this.getMaxPerRow();

    if (direction === 'h') {
      const rowCount = Math.ceil(repeatedPanels.length / maxPerRow);
      stateChange.height = rowCount * itemHeight;
    } else {
      stateChange.height = repeatedPanels.length * itemHeight;
    }

    this.setState(stateChange);

    // In case we updated our height the grid layout needs to be update
    if (prevHeight !== this.state.height) {
      const layout = sceneGraph.getLayout(this);
      if (layout instanceof SceneGridLayout) {
        layout.forceRender();
      }
    }

    // Used from dashboard url sync
    this.publishEvent(new DashboardRepeatsProcessedEvent({ source: this }), true);
  }

  public getMaxPerRow(): number {
    return this.state.maxPerRow ?? 4;
  }

  public getRepeatDirection(): RepeatDirection {
    return this.state.repeatDirection === 'v' ? 'v' : 'h';
  }

  public getClassName() {
    return this.state.variableName ? 'panel-repeater-grid-item' : '';
  }

  public isRepeated() {
    return this.state.variableName !== undefined;
  }

  public static Component = ({ model }: SceneComponentProps<DashboardGridItem>) => {
    const { repeatedPanels, itemHeight, variableName, body } = model.useState();
    const itemCount = repeatedPanels?.length ?? 0;
    const layoutStyle = useLayoutStyle(model.getRepeatDirection(), itemCount, model.getMaxPerRow(), itemHeight ?? 10);

    if (!variableName) {
      if (body instanceof VizPanel) {
        return <body.Component model={body} key={body.state.key} />;
      }

      if (body instanceof LibraryVizPanel) {
        return <body.Component model={body} key={body.state.key} />;
      }

      if (body instanceof AddLibraryPanelDrawer) {
        return <body.Component model={body} key={body.state.key} />;
      }
    }

    if (!repeatedPanels) {
      return null;
    }

    return (
      <div className={layoutStyle}>
        {repeatedPanels.map((panel) => (
          <div className={itemStyle} key={panel.state.key}>
            <panel.Component model={panel} key={panel.state.key} />
          </div>
        ))}
      </div>
    );
  };
}

function useLayoutStyle(direction: RepeatDirection, itemCount: number, maxPerRow: number, itemHeight: number) {
  return useMemo(() => {
    const theme = config.theme2;

    // In mobile responsive layout we have to calculate the absolute height
    const mobileHeight = itemHeight * GRID_CELL_HEIGHT * itemCount + (itemCount - 1) * GRID_CELL_VMARGIN;

    if (direction === 'h') {
      const rowCount = Math.ceil(itemCount / maxPerRow);
      const columnCount = Math.min(itemCount, maxPerRow);

      return css({
        display: 'grid',
        height: '100%',
        width: '100%',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gridTemplateRows: `repeat(${rowCount}, 1fr)`,
        gridColumnGap: theme.spacing(1),
        gridRowGap: theme.spacing(1),

        [theme.breakpoints.down('md')]: {
          display: 'flex',
          flexDirection: 'column',
          height: mobileHeight,
        },
      });
    }

    // Vertical is a bit simpler
    return css({
      display: 'flex',
      height: '100%',
      width: '100%',
      flexDirection: 'column',
      gap: theme.spacing(1),
      [theme.breakpoints.down('md')]: {
        height: mobileHeight,
      },
    });
  }, [direction, itemCount, maxPerRow, itemHeight]);
}

const itemStyle = css({
  display: 'flex',
  flexGrow: 1,
  position: 'relative',
});
