import { useEffect, useState } from 'react';
import { combineLatest } from 'rxjs';

import { LoadingState, NotificationGroup } from '@grafana/data';
import { usePluginNotifications } from '@grafana/runtime/src/services/pluginExtensions/usePluginExtensions';

export function useNotificationGroups(): { groups: NotificationGroup[]; state: LoadingState } {
  const { observables, isLoading } = usePluginNotifications();

  const [groups, setGroups] = useState<NotificationGroup[]>([]);
  const [state, setState] = useState<LoadingState>(isLoading ? LoadingState.Loading : LoadingState.NotStarted);

  useEffect(() => {
    if (observables.length && !isLoading) {
      const sub = combineLatest(observables).subscribe((updates) => {
        const acc: Record<string, NotificationGroup> = {};
        const states = updates.map((update) => update.state);
        updates.forEach((update) => {
          // merge groups with the same id
          update.groups.forEach((group) => {
            if (!acc[group.id]) {
              acc[group.id] = group;
            } else {
              acc[group.id].notifications.push(...group.notifications);
            }
          });
          setGroups(Object.values(acc).sort((a, b) => (b.sortWeight ?? 0) - (a.sortWeight ?? 0)));

          if (isLoading || states.some((state) => state === LoadingState.Loading)) {
            setState(LoadingState.Loading);
          } else if (states.some((state) => state === LoadingState.Error)) {
            setState(LoadingState.Error);
          } else if (states.every((state) => state === LoadingState.Done)) {
            setState(LoadingState.Done);
          } else if (states.every((state) => state === LoadingState.NotStarted)) {
            setState(LoadingState.NotStarted);
          } else {
            setState(LoadingState.Loading);
          }
        });
      });
      return sub.unsubscribe;
    }
    return () => {};
  }, [observables, isLoading]);

  return { groups, state };
}
