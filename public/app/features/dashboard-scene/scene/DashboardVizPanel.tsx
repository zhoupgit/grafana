import { VizPanel, VizPanelMenu, VizPanelState } from '@grafana/scenes';
import { LibraryPanel } from '@grafana/schema';
import { PanelModel } from 'app/features/dashboard/state';
import { getLibraryPanel } from 'app/features/library-panels/state/api';

import { createPanelDataProvider } from '../utils/createPanelDataProvider';

import { DashboardGridItem } from './DashboardGridItem';
import { VizPanelLinks, VizPanelLinksMenu } from './PanelLinks';
import { panelLinksBehavior, panelMenuBehavior } from './PanelMenuBehavior';
import { PanelNotices } from './PanelNotices';

export interface LibraryPanelMeta {
  uid?: string;
  name?: string;
  isLoaded?: boolean;
  _loadedPanel?: LibraryPanel;
}

export class DashboardVizPanel extends VizPanel<{}, {}, LibraryPanelMeta> {
  constructor(state: Partial<VizPanelState<{}, {}, LibraryPanelMeta>>) {
    super({
      meta: {
        isLoaded: state.meta?.isLoaded ?? false,
      },
      ...state,
    });

    this.addActivationHandler(this._anotherActivate);
  }

  private _anotherActivate = () => {
    if (!this.state.meta?.isLoaded) {
      this.loadLibraryPanelFromPanelModel();
    }
  };

  public setPanelFromLibPanel(libPanel: LibraryPanel) {
    if (this.state.meta?._loadedPanel?.version === libPanel.version) {
      return;
    }

    const libPanelModel = new PanelModel(libPanel.model);

    const vizPanelState: VizPanelState = {
      title: libPanelModel.title,
      key: this.state.key,
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

    // this.setState({ _loadedPanel: libPanel, isLoaded: true, name: libPanel.name });
  }

  private async loadLibraryPanelFromPanelModel() {
    // let vizPanel = this.state.panel!;
    // try {
    //   const libPanel = await getLibraryPanel(this.state.uid, true);
    //   this.setPanelFromLibPanel(libPanel);
    //   if (this.parent instanceof DashboardGridItem) {
    //     this.parent.setState({
    //       variableName: libPanel.model.repeat,
    //       repeatDirection: libPanel.model.repeatDirection === 'h' ? 'h' : 'v',
    //       maxPerRow: libPanel.model.maxPerRow,
    //     });
    //   }
    // } catch (err) {
    //   vizPanel.setState({
    //     _pluginLoadError: `Unable to load library panel: ${this.state.uid}`,
    //   });
    // }
  }
}

function getLoadingPanel(title: string, panelKey: string) {
  return new VizPanel({
    key: panelKey,
    title,
    menu: new VizPanelMenu({
      $behaviors: [panelMenuBehavior],
    }),
  });
}
