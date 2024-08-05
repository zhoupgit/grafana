import { ToolbarButton, Drawer, Input, RadioButtonGroup, InlineFieldRow, InlineSwitch } from '@grafana/ui';
import { InlineField } from '@grafana/ui/';

import { useSavedViewsContext } from '../../../savedviews/SavedViewsContext';
import { SavedViewCard } from '../QuickAdd/SavedViewCard';

const searchStyle = {
  display: 'flex',
  gap: '10px',
  padding: '10px 0 10px 0',
};

const inputStyle = {
  width: '100px',
};

export function SavedViewsToggle() {
  const { isOpen, setIsOpen, isAvailable } = useSavedViewsContext();
  if (!isAvailable) {
    return null;
  }
  return (
    <>
      <ToolbarButton
        variant={isOpen ? 'active' : 'default'}
        icon="list-ul"
        tooltip="Saved Views"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <Drawer title="Saved Views" onClose={() => setIsOpen(false)}>
          <div style={searchStyle}>
            <Input width={200} style={inputStyle} placeholder="Search text" />
            <RadioButtonGroup
              onChange={() => {}}
              value="my"
              options={[
                { value: 'my', label: 'My views' },
                { value: 'all', label: 'All views' },
              ]}
            />
          </div>
          <SavedViewCard />
          <SavedViewCard />
          <SavedViewCard />
        </Drawer>
      )}
    </>
  );
}
