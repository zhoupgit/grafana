import { css } from '@emotion/css';
import { useState } from 'react';

import { ToolbarButton, Drawer, Input, RadioButtonGroup, TabsBar, Tab, LinkButton, EmptyState } from '@grafana/ui';

import { useSavedViewsContext } from '../../../savedviews/SavedViewsContext';
import { HistoryView, useAllSavedViewsQuery } from '../../../savedviews/api';
import { myView, savedViewsService } from '../../../savedviews/utils';
import { HistoryViewCard } from '../QuickAdd/HistoryViewCard';
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
  const [counter, setCounter] = useState(0);

  const [scope, setScope] = useState<'my' | 'other'>('my');

  let sortedData = [...(data || [])];
  sortedData.sort((b, a) => a.createdAtTimestamp - b.createdAtTimestamp);

  const deleteHistoryView = (view: HistoryView) => {
    savedViewsService.deleteHistory(view);
    setCounter(counter + 1);
  };

  const deleteAllHistoryViews = () => {
    savedViewsService.clearHistory();
    setCounter(counter + 1);
  };

  const saveHistoryView = (view) => {
    savedViewsService.deleteHistory(view);
    savedViewsService.saveFromHistory(view);
    setActiveTab('savedviews');
  };

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
        label="Recent"
        active={activeTab === 'history'}
        onChangeTab={(e) => {
          e.preventDefault();
          setActiveTab('history');
        }}
      />
    </TabsBar>
  );

  let Content = <p>'loading...'</p>;

  const toShow = sortedData?.filter((view) => {
    const my = scope === 'my' && myView(view);
    const other = scope === 'other' && !myView(view);
    return my || other;
  });

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
              { value: 'other', label: 'Other users' },
            ]}
          />
        </div>

        {toShow?.length === 0 && <EmptyState message="No saved items" variant="not-found" />}

        {toShow
          ?.filter((view) => {
            return searchText.trim() === '' || JSON.stringify(view).includes(searchText);
          })
          .map((view) => {
            return <SavedViewCard key={view.uid} view={view} />;
          })}
      </>
    );
  } else if (activeTab === 'history') {
    const history = savedViewsService.getHistory();
    Content = (
      <>
        <LinkButton
          className={css({ marginBottom: 5 })}
          icon="trash-alt"
          variant="destructive"
          size="xs"
          onClick={() => deleteAllHistoryViews()}
        >
          Delete all recent entries
        </LinkButton>

        {history.length === 0 && <EmptyState message="No entries" variant="not-found" />}

        {history.map((history, index) => {
          return (
            <HistoryViewCard saveHistoryView={saveHistoryView} deleteHistoryView={deleteHistoryView} view={history} />
          );
        })}
      </>
    );
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
