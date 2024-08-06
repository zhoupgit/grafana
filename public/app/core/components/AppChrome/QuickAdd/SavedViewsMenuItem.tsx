import { CustomMenuItemProps } from '@grafana/data/src/types/navModel';

import { useSavedViewsContext } from '../../../savedviews/SavedViewsContext';
import { useAddSavedViewMutation } from '../../../savedviews/api';

export function SavedViewsMenuItem({ MenuItem, onClick }: CustomMenuItemProps) {
  const { setIsOpen } = useSavedViewsContext();
  const [addSavedView] = useAddSavedViewMutation();

  const addCurrent = () => {
    addSavedView({
      name: window.document.title,
      url: window.location.href,
      icon: 'compass',
      description: '...',
    });
  };

  return (
    <MenuItem
      onClick={() => {
        onClick?.();
        addCurrent();
        setIsOpen(true);
      }}
    />
  );
}
