import { useState } from 'react';

import { ToolbarButton, Drawer, Input, RadioButtonGroup, TabsBar, Tab } from '@grafana/ui';

import { useSavedViewsContext } from '../../../savedviews/SavedViewsContext';
import { useAllSavedViewsQuery } from '../../../savedviews/api';
import { myView } from '../../../savedviews/utils';
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
  const [activeTab, setActiveTab] = useState<'savedviews' | 'history'>('savedviews');
  const { data, isLoading, error } = useAllSavedViewsQuery();
  const [searchText, setSearchText] = useState('');

  const [scope, setScope] = useState<'my' | 'all'>('my');

  if (!isAvailable) {
    return null;
  }

  const tabs = (
    <TabsBar>
      <Tab
        label="Saved"
        active={activeTab === 'savedviews'}
        onChangeTab={(e) => {
          e.preventDefault();
          setActiveTab('savedviews');
        }}
      />
      <Tab
        label="History"
        active={activeTab === 'history'}
        onChangeTab={(e) => {
          e.preventDefault();
          setActiveTab('history');
        }}
      />
    </TabsBar>
  );

  let Content = <p>'loading...'</p>;

  if (activeTab === 'savedviews') {
    Content = (
      <>
        <div style={searchStyle}>
          <Input
            width={200}
            style={inputStyle}
            placeholder="Search text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
          <RadioButtonGroup
            onChange={(value) => {
              setScope(value);
            }}
            value={scope}
            options={[
              { value: 'my', label: 'My views' },
              { value: 'all', label: 'All views' },
            ]}
          />
        </div>
        {data
          ?.filter((view) => scope === 'all' || myView(view))
          .filter((view) => {
            return searchText.trim() === '' || JSON.stringify(view).includes(searchText);
          })
          .map((view) => {
            return <SavedViewCard key={view.uid} view={view} />;
          })}
      </>
    );
  } else if (activeTab === 'history') {
    Content = <p>history</p>;
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
        <Drawer tabs={tabs} size="sm" title="Views" onClose={() => setIsOpen(false)}>
          {Content}
        </Drawer>
      )}
    </>
  );
}
