import { baseAPI as api } from './baseAPI';
export const addTagTypes = ['folders'] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getFolders: build.query<GetFoldersApiResponse, GetFoldersApiArg>({
        query: (queryArg) => ({
          url: `/folders`,
          params: {
            limit: queryArg.limit,
            page: queryArg.page,
            parentUid: queryArg.parentUid,
            permission: queryArg.permission,
          },
        }),
        providesTags: ['folders'],
      }),
      createFolder: build.mutation<CreateFolderApiResponse, CreateFolderApiArg>({
        query: (queryArg) => ({ url: `/folders`, method: 'POST', body: queryArg.createFolderCommand }),
        invalidatesTags: ['folders'],
      }),
      deleteFolder: build.mutation<DeleteFolderApiResponse, DeleteFolderApiArg>({
        query: (queryArg) => ({
          url: `/folders/${queryArg.folderUid}`,
          method: 'DELETE',
          params: { forceDeleteRules: queryArg.forceDeleteRules },
        }),
        invalidatesTags: ['folders'],
      }),
      getFolderByUid: build.query<GetFolderByUidApiResponse, GetFolderByUidApiArg>({
        query: (queryArg) => ({ url: `/folders/${queryArg.folderUid}` }),
        providesTags: ['folders'],
      }),
      updateFolder: build.mutation<UpdateFolderApiResponse, UpdateFolderApiArg>({
        query: (queryArg) => ({
          url: `/folders/${queryArg.folderUid}`,
          method: 'PUT',
          body: queryArg.updateFolderCommand,
        }),
        invalidatesTags: ['folders'],
      }),
      getFolderDescendantCounts: build.query<GetFolderDescendantCountsApiResponse, GetFolderDescendantCountsApiArg>({
        query: (queryArg) => ({ url: `/folders/${queryArg.folderUid}/counts` }),
        providesTags: ['folders'],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as petApi };
export type GetFoldersApiResponse = /** status 200 (empty) */ FolderSearchHit[];
export type GetFoldersApiArg = {
  /** Limit the maximum number of folders to return */
  limit?: number;
  /** Page index for starting fetching folders */
  page?: number;
  /** The parent folder UID */
  parentUid?: string;
  /** Set to `Edit` to return folders that the user can edit */
  permission?: 'Edit' | 'View';
};
export type CreateFolderApiResponse = /** status 200 (empty) */ Folder;
export type CreateFolderApiArg = {
  createFolderCommand: CreateFolderCommand;
};
export type DeleteFolderApiResponse = /** status 200 (empty) */ {
  /** ID Identifier of the deleted folder. */
  id: number;
  /** Message Message of the deleted folder. */
  message: string;
  /** Title of the deleted folder. */
  title: string;
};
export type DeleteFolderApiArg = {
  folderUid: string;
  /** If `true` any Grafana 8 Alerts under this folder will be deleted.
    Set to `false` so that the request will fail if the folder contains any Grafana 8 Alerts. */
  forceDeleteRules?: boolean;
};
export type GetFolderByUidApiResponse = /** status 200 (empty) */ Folder;
export type GetFolderByUidApiArg = {
  folderUid: string;
};
export type UpdateFolderApiResponse = /** status 200 (empty) */ Folder;
export type UpdateFolderApiArg = {
  folderUid: string;
  /** To change the unique identifier (uid), provide another one.
    To overwrite an existing folder with newer version, set `overwrite` to `true`.
    Provide the current version to safelly update the folder: if the provided version differs from the stored one the request will fail, unless `overwrite` is `true`. */
  updateFolderCommand: UpdateFolderCommand;
};
export type GetFolderDescendantCountsApiResponse = /** status 200 (empty) */ DescendantCounts;
export type GetFolderDescendantCountsApiArg = {
  folderUid: string;
};
export type FolderSearchHit = {
  id?: number;
  parentUid?: string;
  title?: string;
  uid?: string;
};
export type ErrorResponseBody = {
  /** Error An optional detailed description of the actual error. Only included if running in developer mode. */
  error?: string;
  /** a human readable version of the error */
  message: string;
  /** Status An optional status to denote the cause of the error.
    
    For example, a 412 Precondition Failed error may include additional information of why that error happened. */
  status?: string;
};
export type Metadata = {
  [key: string]: boolean;
};
export type Folder = {
  accessControl?: Metadata;
  canAdmin?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  canSave?: boolean;
  created?: string;
  createdBy?: string;
  hasAcl?: boolean;
  /** Deprecated: use UID instead */
  id?: number;
  orgId?: number;
  /** only used if nested folders are enabled */
  parentUid?: string;
  /** the parent folders starting from the root going down */
  parents?: Folder[];
  title?: string;
  uid?: string;
  updated?: string;
  updatedBy?: string;
  url?: string;
  version?: number;
};
export type CreateFolderCommand = {
  description?: string;
  parentUid?: string;
  title?: string;
  uid?: string;
};
export type UpdateFolderCommand = {
  /** NewDescription it's an optional parameter used for overriding the existing folder description */
  description?: string;
  /** Overwrite only used by the legacy folder implementation */
  overwrite?: boolean;
  /** NewTitle it's an optional parameter used for overriding the existing folder title */
  title?: string;
  /** Version only used by the legacy folder implementation */
  version?: number;
};
export type DescendantCounts = {
  [key: string]: number;
};
export const {
  useGetFoldersQuery,
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetFolderByUidQuery,
  useUpdateFolderMutation,
  useGetFolderDescendantCountsQuery,
} = injectedRtkApi;
