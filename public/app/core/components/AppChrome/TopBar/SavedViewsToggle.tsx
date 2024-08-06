import { useState } from 'react';

import { config } from '@grafana/runtime';
import { ToolbarButton, Drawer, Input, RadioButtonGroup, Button } from '@grafana/ui';

import { contextSrv } from '../../../core';
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
  const { data, isLoading, error } = useAllSavedViewsQuery();
  const [searchText, setSearchText] = useState('');

  const [scope, setScope] = useState<'my' | 'all'>('my');

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
        <Drawer size="sm" title="Saved Views" onClose={() => setIsOpen(false)}>
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
            ?.filter((view) => scope === 'all' || view.user === contextSrv.user.uid)
            .filter((view) => {
              return searchText.trim() === '' || JSON.stringify(view).includes(searchText);
            })
            .map((view) => {
              return <SavedViewCard key={view.uid} view={view} />;
            })}
        </Drawer>
      )}
    </>
  );
}
