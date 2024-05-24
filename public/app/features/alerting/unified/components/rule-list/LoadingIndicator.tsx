import React from 'react';
import { useMeasure } from 'react-use';

import { LoadingBar } from '@grafana/ui';

export const LoadingIndicator = ({ visible = false }) => {
  const [measureRef, { width }] = useMeasure<HTMLDivElement>();
  return <div ref={measureRef}>{visible && <LoadingBar width={width} />}</div>;
};
