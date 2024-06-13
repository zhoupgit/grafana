import { debounce } from 'lodash';

import { urlUtil } from '@grafana/data';
import { getUrlSyncManager, SceneObjectUrlValues, sceneUtils } from '@grafana/scenes';
import { dispatch } from 'app/store/store';

import { notifyApp } from '../../../core/reducers/appNotification';
import { DataTrail } from '../DataTrail';
import { TrailStepType } from '../DataTrailsHistory';
import { BOOKMARKED_TRAILS_KEY, RECENT_TRAILS_KEY } from '../shared';

import { createBookmarkSavedNotification } from './utils';

const MAX_RECENT_TRAILS = 20;

export interface SerializedTrail {
  history: Array<{
    urlValues?: SceneObjectUrlValues;
    urlState: string;
    type: TrailStepType;
    description: string;
    parentIndex: number;
  }>;
  urlState: string;
  currentStep: number;
  createdAt?: number;
}

export interface DataTrailStoreEntry {
  storeRef: SerializedTrail;
  sceneRef?: DataTrail;
}

export class TrailStore {
  private _recent: DataTrailStoreEntry[] = [];
  private _bookmarks: DataTrailStoreEntry[] = [];
  private _save: () => void;

  constructor() {
    this.load();

    const doSave = () => {
      const serializedRecent = this._recent.slice(0, MAX_RECENT_TRAILS).map((trail) => trail.storeRef);

      localStorage.setItem(RECENT_TRAILS_KEY, JSON.stringify(serializedRecent));

      const serializedBookmarks = this._bookmarks.map((trail) => trail.storeRef);
      localStorage.setItem(BOOKMARKED_TRAILS_KEY, JSON.stringify(serializedBookmarks));
    };

    this._save = debounce(doSave, 1000);

    window.addEventListener('beforeunload', (ev) => {
      // Before closing or reloading the page, we want to remove the debounce from `_save` so that
      // any calls to is on event `unload` are actualized. Debouncing would cause a delay until after the page has been unloaded.
      this._save = doSave;
    });
  }

  private _loadFromStorage(key: string): DataTrailStoreEntry[] {
    const storageItem = localStorage.getItem(key);

    if (storageItem) {
      const serializedTrails: SerializedTrail[] = JSON.parse(storageItem);
      return serializedTrails.map((t) => {
        return {
          storeRef: t,
        };
      });
    }

    return [];
  }

  private _deserializeTrail(t: SerializedTrail): DataTrail {
    // reconstruct the trail based on the serialized history
    const trail = new DataTrail({ createdAt: t.createdAt });

    t.history.map((step) => {
      sceneUtils.syncStateFromSearchParams(trail, new URLSearchParams(step.urlState));
      const parentIndex = step.parentIndex ?? trail.state.history.state.steps.length - 1;
      // Set the parent of the next trail step by setting the current step in history.
      trail.state.history.setState({ currentStep: parentIndex });
      trail.state.history.addTrailStep(trail, step.type);
    });

    const currentStep = t.currentStep ?? trail.state.history.state.steps.length - 1;

    trail.state.history.setState({ currentStep });

    trail.setState(
      sceneUtils.cloneSceneObjectState(trail.state.history.state.steps[currentStep].trailState, {
        history: trail.state.history,
      })
    );

    return trail;
  }

  private _serializeTrail(trail: DataTrail): SerializedTrail {
    const history = trail.state.history.state.steps.map((step) => {
      const stepTrail = new DataTrail(sceneUtils.cloneSceneObjectState(step.trailState));
      const urlState = getUrlStateForComparison(stepTrail);

      return {
        urlState,
        type: step.type,
        description: step.description,
        parentIndex: step.parentIndex,
      };
    });

    return {
      history,
      urlState: getUrlStateForComparison(trail),
      currentStep: trail.state.history.state.currentStep,
      createdAt: trail.state.createdAt,
    };
  }

  // Recent Trails
  get recent() {
    return this._recent;
  }

  load() {
    this._recent = this._loadFromStorage(RECENT_TRAILS_KEY);
    this._bookmarks = this._loadFromStorage(BOOKMARKED_TRAILS_KEY);
    this._refreshBookmarkIndexMap();
  }

  setRecentTrail(recentTrail: DataTrail) {
    const { steps } = recentTrail.state.history.state;
    if (steps.length === 0 || (steps.length === 1 && steps[0].type === 'start')) {
      // We do not set an uninitialized trail, or a single node "start" trail as recent
      return;
    }

    // Remove the `recentTrail` from the list if it already exists there
    this._recent = this._recent.filter((t) => t.sceneRef !== recentTrail);

    // Check if any existing "recent" entries have equivalent urlState to the new recentTrail
    const recentUrlState = getUrlStateForComparison(recentTrail); //
    this._recent = this._recent.filter((t) => t.storeRef.urlState !== recentUrlState);

    this._recent.unshift({
      storeRef: this._serializeTrail(recentTrail),
      sceneRef: recentTrail,
    });

    this._save();
  }

  findMatchingRecentTrail(trail: DataTrail) {
    const matchUrlState = getUrlStateForComparison(trail);
    const recent = this._recent.find((t) => t.storeRef.urlState === matchUrlState);

    if (recent) {
      return this._deserializeTrail(recent.storeRef);
    }

    return undefined;
  }

  // Bookmarked Trails
  get bookmarks() {
    return this._bookmarks;
  }

  addBookmark(trail: DataTrail) {
    const bookmark = trail.clone();
    this._bookmarks.unshift({ sceneRef: trail.clone(), storeRef: this._serializeTrail(bookmark) });
    this._refreshBookmarkIndexMap();
    this._save();
    dispatch(notifyApp(createBookmarkSavedNotification()));
  }

  removeBookmark(index: number) {
    if (index < this._bookmarks.length) {
      this._bookmarks.splice(index, 1);
      this._refreshBookmarkIndexMap();
      this._save();
    }
  }

  getBookmarkIndex(trail: DataTrail) {
    const bookmarkKey = getUrlStateForComparison(trail);
    const bookmarkIndex = this._bookmarkIndexMap.get(bookmarkKey);
    return bookmarkIndex;
  }

  private _bookmarkIndexMap = new Map<string, number>();

  private _refreshBookmarkIndexMap() {
    this._bookmarkIndexMap.clear();
    this._bookmarks.forEach((bookmarked, index) => {
      // If there are duplicate bookmarks, the latest index will be kept
      this._bookmarkIndexMap.set(bookmarked.storeRef.urlState, index);
    });
  }
}

function getUrlStateForComparison(trail: DataTrail): string {
  const urlState = getUrlSyncManager().getUrlState(trail);
  // Make a few corrections

  // Omit some URL parameters that are not useful for state comparison
  delete urlState.actionView;
  delete urlState.layout;

  // Populate defaults
  if (urlState['var-groupby'] === '') {
    urlState['var-groupby'] = '$__all';
  }

  return urlUtil.renderUrl('', urlState);
}

let store: TrailStore | undefined;
export function getTrailStore(): TrailStore {
  if (!store) {
    store = new TrailStore();
  }

  return store;
}
