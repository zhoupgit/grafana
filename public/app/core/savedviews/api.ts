import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { lastValueFrom } from 'rxjs';

import { config } from '@grafana/runtime';
import { BackendSrvRequest, getBackendSrv, isFetchError } from '@grafana/runtime/src/services/backendSrv';

import { parseCreatedByValue } from '../../features/query-library/api/mappers';
import { CREATED_BY_KEY } from '../../features/query-library/api/types';

export type SavedViewSpec = {
  apiVersion: string;
  kind: string;
  metadata: {
    generateName: string;
    name?: string;
    creationTimestamp?: string;
    annotations?: { [key: string]: string };
  };
  spec: {
    name: string;
    url: string;
  };
};

export type SavedViewSpecResponse = {
  apiVersion: string;
  items: SavedViewSpec[];
};

/**
 * @alpha
 */
export const API_VERSION = 'savedview.grafana.app/v0alpha1';

/**
 * Query Library is an experimental feature. API (including the URL path) will likely change.
 *
 * @alpha
 */
export const BASE_URL = `/apis/${API_VERSION}/namespaces/${config.namespace}/savedviews/`;

// URL is optional for these requests
interface SavedViewBackendRequest extends Pick<BackendSrvRequest, 'data' | 'method'> {
  url?: string;
}

/**
 * TODO: similar code is duplicated in many places. To be unified in #86960
 */
const baseQuery: BaseQueryFn<SavedViewBackendRequest, SavedViewSpecResponse, Error> = async (requestOptions) => {
  try {
    const responseObservable = getBackendSrv().fetch<SavedViewSpecResponse>({
      url: `${BASE_URL}${requestOptions.url ?? ''}`,
      showErrorAlert: true,
      method: requestOptions.method || 'GET',
      data: requestOptions.data,
    });
    return await lastValueFrom(responseObservable);
  } catch (error) {
    if (isFetchError(error)) {
      return { error: new Error(error.data.message) };
    } else if (error instanceof Error) {
      return { error };
    } else {
      return { error: new Error('Unknown error') };
    }
  }
};

interface SavedView {
  name: string;
  url: string;
}

export const convertSavedViewsResponseToQueryTemplates = (result: SavedViewSpecResponse): SavedView[] => {
  if (!result.items) {
    return [];
  }
  return result.items.map((spec) => {
    return {
      uid: spec.metadata.name || '',
      name: spec.spec.name,
      url: spec.spec.url,
      createdAtTimestamp: new Date(spec.metadata.creationTimestamp || '').getTime(),
      user: parseCreatedByValue(spec.metadata?.annotations?.[CREATED_BY_KEY]),
    };
  });
};

export interface AddSavedViewCommand {
  name: string;
  url: string;
}

export const convertAddSavedViewCommandToDataQuerySpec = (addSavedViewCommand: AddSavedViewCommand): SavedViewSpec => {
  const { name, url } = addSavedViewCommand;
  return {
    apiVersion: API_VERSION,
    kind: 'SavedView',
    metadata: {
      generateName: 'A' + name.replaceAll(' ', '-'),
    },
    spec: {
      name,
      url,
    },
  };
};

export const savedViewApi = createApi({
  baseQuery,
  endpoints: (builder) => ({
    allSavedViews: builder.query<SavedView[], void>({
      query: () => ({}),
      transformResponse: convertSavedViewsResponseToQueryTemplates,
      providesTags: ['SavedViewsList'],
    }),
    addSavedView: builder.mutation<SavedView, AddSavedViewCommand>({
      query: (command: AddSavedViewCommand) => ({
        method: 'POST',
        data: convertAddSavedViewCommandToDataQuerySpec(command),
      }),
      invalidatesTags: ['SavedViewsList'],
    }),
    // deleteQueryTemplate: builder.mutation<void, DeleteQueryTemplateCommand>({
    //   query: ({ uid }) => ({
    //     url: `${uid}`,
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['SavedViewsList'],
    // }),
  }),
  tagTypes: ['SavedViewsList'],
  reducerPath: 'savedViews',
});

export const { useAllSavedViewsQuery, useAddSavedViewMutation } = savedViewApi;
