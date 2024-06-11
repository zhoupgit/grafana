import { css } from 'emotion';
import React from 'react';
import { useAsync } from 'react-use';
import AutoSizer from 'react-virtualized-auto-sizer';

import { GrafanaTheme2 } from '@grafana/data';
import { selectors as e2eSelectors } from '@grafana/e2e-selectors';
import { SceneComponentProps, SceneObjectRef } from '@grafana/scenes';
import { Button, ClipboardButton, CodeEditor, Label, Stack, Switch, useTheme2 } from '@grafana/ui';
import { Trans } from 'app/core/internationalization';

import { DashboardScene } from '../../scene/DashboardScene';
import { ShareExportTab } from '../ShareExportTab';

const selector = e2eSelectors.pages.ExportDashboardDrawer.ExportAsJson;

export interface Props {
  dashboardRef: SceneObjectRef<DashboardScene>;
}

export class ExportAsJSON extends ShareExportTab {
  static Component = ExportAsJSONRenderer;
}

function ExportAsJSONRenderer({ model }: SceneComponentProps<ExportAsJSON>) {
  const theme = useTheme2();
  const styles = getStyles(theme);

  const { isSharingExternally, dashboardRef } = model.useState();

  const onCancelClick = () => {
    dashboardRef.resolve().closeModal();
  };

  const dashboardJson = useAsync(async () => {
    const json = await model.getExportableDashboardJson();
    return JSON.stringify(json, null, 2);
  }, [isSharingExternally]);

  return (
    <>
      <p className="export-json-drawer-info-text">
        <Trans i18nKey="export.json.info-text">
          Copy or download a JSON file containing the JSON of your dashboard.
        </Trans>
      </p>

      <div className={styles.switchItem}>
        <Switch
          data-testid={selector.exportExternallyToggle}
          id="export-externally-toggle"
          value={isSharingExternally}
          onChange={model.onShareExternallyChange}
        />
        <Label className={styles.switchItemLabel}>
          <Trans i18nKey="export.json.export-externally-label">Export the dashboard to use in another instance</Trans>
        </Label>
      </div>

      <AutoSizer disableHeight className={styles.codeEditorBox} data-testid={selector.codeEditor}>
        {({ width }) => {
          if (dashboardJson.value) {
            return (
              <CodeEditor
                value={dashboardJson.value ?? ''}
                language="json"
                showMiniMap={false}
                height="500px"
                width={width}
                readOnly={true}
              />
            );
          }

          if (dashboardJson.loading) {
            return (
              <div>
                <Trans i18nKey="export.json.loading-text">Loading...</Trans>
              </div>
            );
          }

          return null;
        }}
      </AutoSizer>

      <Stack direction="row" wrap="wrap" alignItems="flex-start" gap={2} justifyContent="start">
        <Button
          data-testid={selector.saveToFileButton}
          variant="primary"
          icon="download-alt"
          onClick={model.onSaveAsFile}
        >
          <Trans i18nKey="export.json.save-button">Save to file</Trans>
        </Button>
        <ClipboardButton
          data-testid={selector.copyToClipboardButton}
          variant="secondary"
          icon="copy"
          disabled={dashboardJson.loading}
          getText={() => dashboardJson.value ?? ''}
        >
          <Trans i18nKey="export.json.copy-button">Copy to Clipboard</Trans>
        </ClipboardButton>
        <Button data-testid={selector.cancelButton} variant="secondary" onClick={onCancelClick} fill="outline">
          <Trans i18nKey="export.json.cancel-button">Cancel</Trans>
        </Button>
      </Stack>
    </>
  );
}

function getStyles(theme: GrafanaTheme2) {
  return {
    switchItem: css({
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    }),
    switchItemLabel: css({
      margin: `0 0 0 ${theme.spacing(1)}`,
      alignSelf: 'center',
    }),
    codeEditorBox: css({
      margin: '16px 0px',
    }),
  };
}
