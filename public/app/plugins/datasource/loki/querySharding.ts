import { Observable, Subscriber, Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { arrayToDataFrame, DataQueryRequest, DataQueryResponse, DataTopic, LoadingState } from '@grafana/data';
import { combineResponses } from '@grafana/o11y-ds-frontend';

import { STREAM_SHARD_LABEL } from './LanguageProvider';
import { LokiDatasource } from './datasource';
import { addLabelToQuery } from './modifyQuery';
import { LOADING_FRAME_NAME } from './querySplitting';
import { isLogsQuery } from './queryUtils';
import { LabelType, LokiQuery } from './types';

// shard number
export type LokiGroupedRequest = { request: DataQueryRequest<LokiQuery>; partition: string[] };

export function runShardedQueries(
  datasource: LokiDatasource,
  request: DataQueryRequest<LokiQuery>,
  shards: string[]
): Observable<DataQueryResponse> {
  const queries = request.targets.filter((query) => !query.hide).filter((query) => query.expr);

  const query = queries[0];
  const shardQueries: LokiQuery[] = shards.map((shard) => {
    const expr = addLabelToQuery(query.expr, STREAM_SHARD_LABEL, '=', shard, LabelType.Indexed);
    return { ...query, expr };
  });

  const shardRequests: Array<DataQueryRequest<LokiQuery>> = shardQueries.map((shardQuery) => {
    return {
      ...request,
      targets: [
        {
          ...shardQuery,
          // maxLines: Math.floor((shardQuery.maxLines ?? 1000) / shardQueries.length)
          // maxLines: 100, // just get one from each shard for now
          // maxDataPoints: 1,
        },
      ],
    };
  });

  // const queue = new ObservableQueue()
  //
  // const observablesArray = shardRequests.map(request=> {
  //   return datasource.runQuery(request)
  // })

  console.log('shardQueries', shardQueries);
  // console.log('queue', queue)
  // console.log('observablesArray', observablesArray)
  console.log('shardRequests', shardRequests);

  let shouldStop = false;
  let subquerySubsciption: Subscription | null = null;
  const responseKey = shardRequests.length ? shardRequests[0].queryGroupId : uuidv4();
  let mergedResponse: DataQueryResponse = { data: [], state: LoadingState.Streaming, key: responseKey };

  const response = new Observable<DataQueryResponse>((subscriber) => {
    runNextRequest(subscriber, shardRequests.length, 0);
    return () => {
      if (subquerySubsciption != null) {
        subquerySubsciption.unsubscribe();
      }
    };
  });

  const runNextRequest = (subscriber: Subscriber<DataQueryResponse>, length: number, requestN: number) => {
    if (shouldStop) {
      console.log('should stop');
      subscriber.complete();
      return;
    }

    const done = () => {
      mergedResponse.state = LoadingState.Done;
      subscriber.next(mergedResponse);
      subscriber.complete();
    };

    const nextRequest = () => {
      const { nextRequestN } = getNextRequestPointers(shardRequests, requestN);
      if (nextRequestN < length) {
        runNextRequest(subscriber, length, nextRequestN);
        return;
      }
      console.log('hitting done');
      done();
    };

    const request = shardRequests[requestN];
    const targets = adjustTargetsFromResponseState(request.targets, mergedResponse, length - requestN);

    if (!targets.length) {
      nextRequest();
      return;
    }

    const subRequest = { ...shardRequests[requestN], targets };
    // request may not have a request id
    if (request.requestId) {
      subRequest.requestId = `${request.requestId}_${requestN}`;
    }

    console.log('initial request', subRequest);

    subquerySubsciption = datasource.runQuery(subRequest).subscribe({
      next: (partialResponse) => {
        if (partialResponse.data?.[0]?.length > 0) {
          console.log('data was recievedf', partialResponse);
        }

        mergedResponse = combineResponses(mergedResponse, partialResponse);
        mergedResponse = updateLoadingFrame(mergedResponse, subRequest, requestN);
        if ((mergedResponse.errors ?? []).length > 0 || mergedResponse.error != null) {
          shouldStop = true;
        }
      },
      complete: () => {
        subscriber.next(mergedResponse);
        nextRequest();
      },
      error: (error) => {
        console.log('error', error);
        subscriber.error(error);
      },
    });
  };

  return response;
}

function adjustTargetsFromResponseState(
  targets: LokiQuery[],
  response: DataQueryResponse | null,
  length: number
): LokiQuery[] {
  if (!response) {
    return targets;
  }

  return targets
    .map((target) => {
      if (!target.maxLines || !isLogsQuery(target.expr)) {
        return target;
      }
      console.log('target.maxLines', target.maxLines);
      const targetFrame = response.data.find((frame) => frame.refId === target.refId);
      const updatedMaxLines = target.maxLines - (targetFrame?.length ?? 0);
      const actualMaxLines = Math.min(
        updatedMaxLines < 0 ? 0 : updatedMaxLines,
        Math.floor(target.maxLines / (length / 2))
      );
      console.log('actualMaxLines', actualMaxLines);
      return {
        ...target,
        maxLines: actualMaxLines,
      };
    })
    .filter((target) => target.maxLines === undefined || target.maxLines > 0);
}

export class ObservableQueue {
  private queue: Array<Observable<DataQueryResponse>> = [];

  push(original: Observable<DataQueryResponse>): Observable<DataQueryResponse> {
    this.queue.push(original);

    return new Observable<DataQueryResponse>((observer) => {
      if (this.queue.length > 0) {
        const first = this.queue[0];
        if (first === original) {
          original.subscribe((...args) => {
            observer.next(...args);
            observer.complete();
            this.queue.shift();
          });
        }
      }
    });
  }
}

function getNextRequestPointers(requests: Array<DataQueryRequest<LokiQuery>>, requestN: number) {
  return {
    nextRequestN: requestN + 1,
  };
}

function updateLoadingFrame(
  response: DataQueryResponse,
  request: DataQueryRequest<LokiQuery>,
  requestN: number
): DataQueryResponse {
  if (isLogsQuery(request.targets[0].expr)) {
    return response;
  }
  response.data = response.data.filter((frame) => frame.name !== LOADING_FRAME_NAME);

  if (requestN <= 1) {
    return response;
  }

  const loadingFrame = arrayToDataFrame([
    {
      time: request.range.from.valueOf(),
      timeEnd: request.range.to.valueOf(),
      isRegion: true,
      color: 'rgba(120, 120, 120, 0.1)',
    },
  ]);
  loadingFrame.name = LOADING_FRAME_NAME;
  loadingFrame.meta = {
    dataTopic: DataTopic.Annotations,
  };

  response.data.push(loadingFrame);

  return response;
}
