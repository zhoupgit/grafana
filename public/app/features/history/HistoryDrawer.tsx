import React from 'react';
import { useToggle } from 'react-use';

import { Drawer, ToolbarButton } from '@grafana/ui';

export function HistoryDrawer() {
  const [isOpen, toggleIsOpen] = useToggle(false);

  return (
    <>
      <ToolbarButton icon="history-alt" tooltip="History" onClick={toggleIsOpen} />
      {isOpen && (
        <Drawer
          title="Grafana history"
          subtitle="A complete journal of your travels within Grafana"
          onClose={toggleIsOpen}
        >
          Body
        </Drawer>
      )}
    </>
  );
}
