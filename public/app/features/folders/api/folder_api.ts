import { FolderListItemDTO } from 'app/types';
import { getBackendSrv, config } from '@grafana/runtime';
import { Resource, ResourceClient, ResourceForCreate } from 'app/features/apiserver/types';
import { ScopedResourceClient } from 'app/features/apiserver/client';

export interface FolderAPI {
  createFolder(folder: Folder): Promise<FolderListItemDTO>;
}

// #TODO add fields
// #TODO how to handle nested folders?
export interface Folder {
  title: string;
}

// Implemented using /api/folders/*
class LegacyFolderAPI implements FolderAPI {
  constructor() {}

  // #TODO replace FolderListItemDTO
  async createFolder(folder: Folder): Promise<FolderListItemDTO> {
    return getBackendSrv().post<FolderListItemDTO>('/api/folders', folder)
  }
}

// #TODO add more fields
interface FolderSpec {
  uid: string;
  title: string;
}

// Implemented using /apis/folders.grafana.app/*
class K8sFolderAPI implements FolderAPI {
  private client: ResourceClient<FolderSpec>;

  constructor() {
      this.client = new ScopedResourceClient<FolderSpec>({
      group: 'folder.grafana.app',
      version: 'v0alpha1',
      resource: 'folders',
      });
  }

  async createFolder(folder: Folder): Promise<FolderListItemDTO> {
    const body = this.folderAsK8sResource(folder);
    return this.client.create(body).then((v) => this.asFolderListItemDTO(v));
  }

  asFolderListItemDTO(v: Resource<FolderListItemDTO>): FolderListItemDTO {
    return {
      uid: v.metadata.name,
      title: v.spec.title,
    };
  }

  folderAsK8sResource = (folder: Folder): ResourceForCreate<FolderSpec> => {
    return {
      metadata: {},
      spec: {
        title: folder.title,
        uid: '',
      },
    };
  };
}

let instance: FolderAPI | undefined = undefined;

export function getFolderAPI() {
  if (!instance) {
    instance = config.featureToggles.kubernetesFolders ? new K8sFolderAPI() : new LegacyFolderAPI();
  }
  return instance;
}
