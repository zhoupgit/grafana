import { useState, useEffect } from 'react';

import { PageLayoutType } from '@grafana/data';
import { Box } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';


export default function IFramedDashboardTestPage() {
  const [state, setState] = useState('?from=now-5m&to=now');

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data)
        console.log("Hello World?", data)
      }
      catch(ex) {
        console.log("GOT", event)
      }
    }

    window.addEventListener("message", (handler))

    // clean up
    return () => window.removeEventListener("message", handler)
  }, []) // empty array => run only once

  return (
    <Page
      navId="dashboards/browse"
      pageNav={{ text: 'Embedding dashboard (iframe)', subTitle: 'Showing dashboard: Panel Tests - Pie chart' }}
      layout={PageLayoutType.Canvas}
    >
      <Box paddingY={2}>IFramed url state: {state}</Box>

      <iframe
        src="/d/MP-Di9F7k/candlestick?orgId=1&kiosk"
        title="dashboard"
        width="100%"
        height="100%"
        style={{ border: '1px solid red' }}
        onChange={(v) => {
          console.log("iframe onchange", v);
        }}
        onLoad={(v) => {
          console.log("iframe load", v);
        }}
      ></iframe>
    </Page>
  );
}
