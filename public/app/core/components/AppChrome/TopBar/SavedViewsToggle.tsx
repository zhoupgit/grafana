import { ToolbarButton, Drawer, Input, RadioButtonGroup, Button } from '@grafana/ui';

import { useSavedViewsContext } from '../../../savedviews/SavedViewsContext';
import { useAddSavedViewMutation, useAllSavedViewsQuery } from '../../../savedviews/api';
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
  const [addSavedView] = useAddSavedViewMutation();
  const { data, isLoading, error } = useAllSavedViewsQuery();

  console.log(data, isLoading, error);

  if (!isAvailable) {
    return null;
  }

  const test = () => {
    addSavedView({
      name: 'test',
      url: 'url',
    });
  };

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
            <Button onClick={test}>Test</Button>
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
