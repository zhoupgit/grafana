import { BackendSrvRequest, getBackendSrv } from '@grafana/runtime';

import { getFieldDataContextClone } from '../field/fieldOverrides';

import { DataContextScopedVar, ScopedVars } from './ScopedVars';
import { DataFrame, Field, ValueLinkConfig } from './dataFrame';
import { InterpolateFunction } from './panel';
import { SelectableValue } from './select';

export interface Action<T = any> {
  title: string;
  method: string;
  endpoint: string;
  data?: string;
  contentType?: string;
  queryParams?: Array<[string, string]>;
  headerParams?: Array<[string, string]>;

  // If exists, handle click directly
  // Not saved in JSON/DTO
  onClick?: (event: ActionClickEvent) => T;
}

/**
 * Processed Action Model. The values are ready to use
 */
export interface ActionModel<T = any> {
  title: string;

  // When a click callback exists, this is passed the raw mouse|react event
  onClick?: (e: any, origin?: any) => void;
}

export interface ActionClickEvent<T = any> {
  origin: T;
  replaceVariables: InterpolateFunction | undefined;
  e?: any; // mouse|react event
}
export enum HttpRequestMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
}

export const httpMethodOptions = [
  { label: HttpRequestMethod.GET, value: HttpRequestMethod.GET },
  { label: HttpRequestMethod.POST, value: HttpRequestMethod.POST },
  { label: HttpRequestMethod.PUT, value: HttpRequestMethod.PUT },
];

export const contentTypeOptions: SelectableValue[] = [
  { label: 'JSON', value: 'application/json' },
  { label: 'Text', value: 'text/plain' },
  { label: 'JavaScript', value: 'application/javascript' },
  { label: 'HTML', value: 'text/html' },
  { label: 'XML', value: 'application/XML' },
  { label: 'x-www-form-urlencoded', value: 'application/x-www-form-urlencoded' },
];

export const defaultActionConfig: Action = {
  title: '',
  endpoint: '',
  method: HttpRequestMethod.POST,
  data: '{}',
  contentType: 'application/json',
  queryParams: [],
  headerParams: [],
};

export const getActionsSupplier =
  (frame: DataFrame, field: Field, fieldScopedVars: ScopedVars, replaceVariables: InterpolateFunction) =>
  (config: ValueLinkConfig): Array<ActionModel<Field>> => {
    if (!field.config.actions || field.config.actions.length === 0) {
      return [];
    }

    const actionModels = field.config.actions.map((action: Action) => {
      const dataContext: DataContextScopedVar = getFieldDataContextClone(frame, field, fieldScopedVars);
      const actionScopedVars = {
        ...fieldScopedVars,
        __dataContext: dataContext,
      };

      const boundReplaceVariables: InterpolateFunction = (value, scopedVars, format) =>
        replaceVariables(value, { ...actionScopedVars, ...scopedVars }, format);

      // We are not displaying reduction result
      if (config.valueRowIndex !== undefined && !isNaN(config.valueRowIndex)) {
        dataContext.value.rowIndex = config.valueRowIndex;
      } else {
        dataContext.value.calculatedValue = config.calculatedValue;
      }

      let actionModel: ActionModel<Field> = { title: '' };

      if (action.onClick) {
        actionModel = {
          title: replaceVariables(action.title || '', actionScopedVars),
          onClick: (evt: MouseEvent, origin: Field) => {
            action.onClick!({
              origin: origin ?? field,
              e: evt,
              replaceVariables: boundReplaceVariables,
            });
          },
        };
      } else {
        // request
        actionModel = {
          title: replaceVariables(action.title || '', actionScopedVars),
          onClick: (evt: MouseEvent, origin: Field) => {
            buildActionOnClick(action, boundReplaceVariables);
          },
        };
      }

      return actionModel;
    });

    return actionModels.filter((action): action is ActionModel => !!action);
  };

const buildActionOnClick = (action: Action, replaceVariables: InterpolateFunction) => {
  const url = new URL(replaceVariables(action.endpoint));
  const data = getData(action, replaceVariables);

  const requestHeaders: HeadersInit = [];
  let request: BackendSrvRequest = {
    url: url.toString(),
    method: action.method,
    data: data,
    headers: requestHeaders,
  };

  if (action.headerParams) {
    action.headerParams.forEach((param) => {
      requestHeaders.push([replaceVariables(param[0]), replaceVariables(param[1])]);
    });
  }

  if (action.queryParams) {
    action.queryParams?.forEach((param) => {
      url.searchParams.append(replaceVariables(param[0]), replaceVariables(param[1]));
    });

    request.url = url.toString();
  }

  if (action.method === HttpRequestMethod.POST) {
    requestHeaders.push(['Content-Type', action.contentType!]);
  }

  request.headers = requestHeaders;

  getBackendSrv()
    .fetch(request)
    .subscribe({
      error: (error) => {
        // appEvents.emit(AppEvents.alertError, ['An error has occurred. Check console output for more details.']);
        console.error('API call error: ', error);
        // updateLoadingStateCallback && updateLoadingStateCallback(false);
      },
      complete: () => {
        // appEvents.emit(AppEvents.alertSuccess, ['API call was successful']);
        console.log('API call was successful');
        // updateLoadingStateCallback && updateLoadingStateCallback(false);
      },
    });
};

const getData = (api: Action, replaceVariables: InterpolateFunction) => {
  let data: string | undefined = api.data ? replaceVariables(api.data) : '{}';
  if (api.method === HttpRequestMethod.GET) {
    data = undefined;
  }

  return data;
};
