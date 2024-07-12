import { map, Observable, defer, mergeMap } from 'rxjs';

import {
  DataFrameJSON,
  DataQueryRequest,
  DataQueryResponse,
  LiveChannelScope,
  LoadingState,
  StreamingDataFrame,
  QueryResultMetaStat,
} from '@grafana/data';
import { getGrafanaLiveSrv, config } from '@grafana/runtime';

import { LokiDatasource } from './datasource';
import { LokiQuery } from './types';

/**
 * Calculate a unique key for the query.  The key is used to pick a channel and should
 * be unique for each distinct query execution plan.  This key is not secure and is only picked to avoid
 * possible collisions
 */
export async function getLiveStreamKey(query: LokiQuery): Promise<string> {
  const str = JSON.stringify({ expr: query.expr });

  const msgUint8 = new TextEncoder().encode(str); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer.slice(0, 8))); // first 8 bytes
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// This will get both v1 and v2 result formats
export function doLokiChannelStream(
  query: LokiQuery,
  ds: LokiDatasource,
  options: DataQueryRequest<LokiQuery>
): Observable<DataQueryResponse> {
  console.log("Starting stream");
  const range = options.range;
  const maxDelta = range.to.valueOf() - range.from.valueOf() + 1000;
  let maxLength = options.maxDataPoints ?? 1000;
  if (maxLength > 100) {
    // for small buffers, keep them small
    maxLength *= 2;
  }

  let frame: StreamingDataFrame | undefined = undefined;
  let combinedFrames: StreamingDataFrame | undefined = undefined;

  const updateFrame = (msg: any) => {
    if (msg?.message) {
      const p: DataFrameJSON = msg.message;
      if (!frame) {
        frame = StreamingDataFrame.fromDataFrameJSON(p, {
          maxLength,
          maxDelta,
          displayNameFormat: query.legendFormat,
        });
      } else {
        frame.push(p);
      }
    }
    return frame;
  };

  return defer(() => getLiveStreamKey(query)).pipe(
    mergeMap((key) => {
      return getGrafanaLiveSrv()
        .getStream({
          scope: LiveChannelScope.DataSource,
          namespace: ds.uid,
          path: `mtail/${key}`,
          data: {
            ...query,
            timeRange: {
              from: range.from.toISOString(),
              to: range.to.toISOString(),
            },
          },
        })
        .pipe(
          map((evt) => {
            console.log("received event:", evt);
            const frame = updateFrame(evt);
            if (combinedFrames === undefined) {
              combinedFrames = deepClone(frame);
            } else {
              if (frame !== undefined) {
                combineFrames(combinedFrames, frame);
              }
            }
            return {
              data: combinedFrames ? [combinedFrames] : [],
              state: LoadingState.Streaming,
            };
          })
        );  
    })
  );
}

export const convertToWebSocketUrl = (url: string) => {
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  let backend = `${protocol}${window.location.host}${config.appSubUrl}`;
  if (backend.endsWith('/')) {
    backend = backend.slice(0, -1);
  }
  return `${backend}${url}`;
};


function combineFrames(dest: StreamingDataFrame, source: StreamingDataFrame) {
  console.log("combining frames: dest: %s, source: %s", dest.fields.length, source.fields.length);

  // `dest` and `source` might have more or less fields, we need to go through all of them
  const totalFields = Math.max(dest.fields.length, source.fields.length);
  for (let i = 0; i < totalFields; i++) {
    // For now, skip undefined fields that exist in the new frame
    if (!dest.fields[i]) {
      continue;
    }
    // Index is not reliable when frames have disordered fields, or an extra/missing field, so we find them by name.
    // If the field has no name, we fallback to the old index version.
    const sourceField = dest.fields[i].name
      ? source.fields.find((f) => f.name === dest.fields[i].name)
      : source.fields[i];
    if (!sourceField) {
      continue;
    }
    dest.fields[i].values = [].concat.apply(sourceField.values, dest.fields[i].values);
    if (sourceField.nanos) {
      const nanos: number[] = dest.fields[i].nanos?.slice() || [];
      dest.fields[i].nanos = source.fields[i].nanos?.concat(nanos);
    }
  }
  dest.length += source.length;
  dest.meta = {
    ...dest.meta,
    stats: getCombinedMetadataStats(dest.meta?.stats ?? [], source.meta?.stats ?? []),
  };
  console.log("combined frames: dest: %s, source: %s", dest.fields.length, source.fields.length);
}


const TOTAL_BYTES_STAT = 'Summary: total bytes processed';
// This is specific for Loki
function getCombinedMetadataStats(
  destStats: QueryResultMetaStat[],
  sourceStats: QueryResultMetaStat[]
): QueryResultMetaStat[] {
  // in the current approach, we only handle a single stat
  const destStat = destStats.find((s) => s.displayName === TOTAL_BYTES_STAT);
  const sourceStat = sourceStats.find((s) => s.displayName === TOTAL_BYTES_STAT);

  if (sourceStat != null && destStat != null) {
    return [{ value: sourceStat.value + destStat.value, displayName: TOTAL_BYTES_STAT, unit: destStat.unit }];
  }

  // maybe one of them exist
  const eitherStat = sourceStat ?? destStat;
  if (eitherStat != null) {
    return [eitherStat];
  }

  return [];
}

function deepClone(frame: StreamingDataFrame | undefined): StreamingDataFrame | undefined {
  // clone the frame and return
  if (frame === undefined) {
    return undefined;
  }
  let f = frame.serialize();
  return StreamingDataFrame.deserialize(f);
}

