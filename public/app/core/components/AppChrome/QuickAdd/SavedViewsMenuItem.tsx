import { CustomMenuItemProps } from '@grafana/data/src/types/navModel';

import { useSavedViewsContext } from '../../../savedviews/SavedViewsContext';
import { useAddSavedViewMutation } from '../../../savedviews/api';
import { savedViewsService } from '../../../savedviews/utils';

export function SavedViewsMenuItem({ MenuItem, onClick }: CustomMenuItemProps) {
  const { setIsOpen } = useSavedViewsContext();
  const [addSavedView] = useAddSavedViewMutation();

  const addCurrent = () => {
    const view = savedViewsService.getCommand();
    addSavedView(view);
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
