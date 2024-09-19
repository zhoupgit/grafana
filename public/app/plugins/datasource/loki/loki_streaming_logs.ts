import {map, Observable, takeWhile} from "rxjs";
import {v4 as uuidv4} from "uuid";

import {DataQueryRequest, DataQueryResponse, LiveChannelScope, LoadingState, StreamingDataFrame} from "@grafana/data";
import { getGrafanaLiveSrv } from "@grafana/runtime";

import {LokiDatasource} from "./datasource";
import {LokiQuery} from "./types";


export function runStreamingLogQuery(ds: LokiDatasource, request: DataQueryRequest<LokiQuery>): Observable<DataQueryResponse> {
  console.log('runStreamingLogQuery', ds, request);
  let state: LoadingState = LoadingState.NotStarted;
  const query = request.targets.map((target) => {
    return {
      expr: target.expr,
      refId: target.refId,
    }
  });
  
  return getGrafanaLiveSrv().getStream<StreamingDataFrame>({
    scope: LiveChannelScope.DataSource,
    namespace: ds.uid,
    path: `logStream/${liveStreamKey()}`,
    data: {
      query,
      timeRange: {
        from: request.range.from.valueOf().toString(),
        to: request.range.to.valueOf().toString()
      },
    }
  }).pipe(
    takeWhile(() => {
      return true;
    }, true)
  ).pipe(
    map((evt) => {
      console.log(evt);
      return {
        data: [],
        state,
      };
    })
  );
}

function liveStreamKey(): string {
  return uuidv4();
}
