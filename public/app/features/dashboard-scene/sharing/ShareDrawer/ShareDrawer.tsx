import { config, locationService } from '@grafana/runtime';
import { SceneComponentProps, SceneObjectBase, SceneObjectRef, SceneObjectState, VizPanel } from '@grafana/scenes';
import { Drawer } from '@grafana/ui';

import { contextSrv } from '../../../../core/services/context_srv';
import { isPublicDashboardsEnabled } from '../../../dashboard/components/ShareModal/SharePublicDashboard/SharePublicDashboardUtils';
import { getDashboardSceneFor } from '../../utils/utils';
import { ExportAsJson } from '../ExportButton/ExportAsJson';
import { ShareExternally } from '../ShareButton/share-externally/ShareExternally';
import { ShareInternally } from '../ShareButton/share-internally/ShareInternally';
import { ShareSnapshot } from '../ShareButton/share-snapshot/ShareSnapshot';
import { SharePanelEmbedTab } from '../SharePanelEmbedTab';
import { SharePanelInternally } from '../panel-share/SharePanelInternally';
import { ModalSceneObjectLike, SceneShareTab, SceneShareTabState } from '../types';

import { ShareDrawerContext } from './ShareDrawerContext';

export interface ShareDrawerState extends SceneObjectState {
  panelRef?: SceneObjectRef<VizPanel>;
  activeShareView: string;
  shareOptions?: SceneShareTab[];
}

type CustomDashboardShareViewType = new (...args: SceneShareTabState[]) => SceneShareTab;

const customDashboardShareView: CustomDashboardShareViewType[] = [];

export function addDashboardShareView(shareView: CustomDashboardShareViewType) {
  customDashboardShareView.push(shareView);
}

export class ShareDrawer extends SceneObjectBase<ShareDrawerState> implements ModalSceneObjectLike {
  static Component = ShareDrawerRenderer;

  constructor(state: Omit<ShareDrawerState, 'shareOptions'>) {
    super(state);
    this.addActivationHandler(() => this.buildActiveShare(state.activeShareView));
  }

  onDismiss = () => {
    if (this.state.panelRef) {
      const dashboard = getDashboardSceneFor(this);
      dashboard.closeModal();
    } else {
      locationService.partial({ shareView: null });
    }
  };

  private buildActiveShare(activeShareView: string) {
    const { panelRef } = this.state;
    const dashboard = getDashboardSceneFor(this);

    const shareOptions: SceneShareTab[] = [
      new ShareInternally({ onDismiss: this.onDismiss }),
      new ExportAsJson({ onDismiss: this.onDismiss }),
    ];

    if (contextSrv.isSignedIn && config.snapshotEnabled && dashboard.canEditDashboard()) {
      shareOptions.push(new ShareSnapshot({ dashboardRef: dashboard.getRef(), panelRef, onDismiss: this.onDismiss }));
    }
    if (isPublicDashboardsEnabled()) {
      shareOptions.push(new ShareExternally({ onDismiss: this.onDismiss }));
    }

    if (panelRef) {
      shareOptions.push(
        new SharePanelInternally({ panelRef, onDismiss: this.onDismiss }),
        new SharePanelEmbedTab({ panelRef, onDismiss: this.onDismiss })
      );
    }

    shareOptions.push(...customDashboardShareView.map((ShareOption) => new ShareOption({ onDismiss: this.onDismiss })));

    const activeShareOption = shareOptions.find((s) => s.tabId === activeShareView);

    this.setState({ activeShareView: activeShareOption?.tabId ?? shareOptions[0].tabId, shareOptions });
  }
}

function ShareDrawerRenderer({ model }: SceneComponentProps<ShareDrawer>) {
  const { activeShareView, shareOptions } = model.useState();
  const dashboard = getDashboardSceneFor(model);

  const currentShareOption = shareOptions?.find((s) => s.tabId === activeShareView)!;

  return (
    <Drawer title={currentShareOption.getTabLabel()} onClose={model.onDismiss} size="md">
      <ShareDrawerContext.Provider value={{ dashboard }}>
        {<currentShareOption.Component model={currentShareOption} />}
      </ShareDrawerContext.Provider>
    </Drawer>
  );
}
