import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { savedViewsService } from '../savedviews/utils';

export const SavedViewsListener = () => {
  const location = useLocation();
  const previousPath = useRef<string | undefined>();

  useEffect(() => {
    if (location.pathname === '/') {
      return;
    }
    if (previousPath.current !== location.pathname) {
      savedViewsService.pushHistory();
    } else {
      savedViewsService.updateHistory();
    }
    previousPath.current = location.pathname;
  }, [location.pathname, location.search]);
};
