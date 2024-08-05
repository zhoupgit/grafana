import { CustomMenuItemProps } from '@grafana/data/src/types/navModel';

import { useSavedViewsContext } from '../../../savedviews/SavedViewsContext';

export function SavedViewsMenuItem({ MenuItem, onClick }: CustomMenuItemProps) {
  const { setIsOpen } = useSavedViewsContext();

  return (
    <MenuItem
      onClick={() => {
        onClick?.();
        console.log('Save new saved view');
        setIsOpen(true);
      }}
    />
  );
}
