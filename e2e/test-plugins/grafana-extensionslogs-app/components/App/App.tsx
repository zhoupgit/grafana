import { Route, Routes } from 'react-router-dom';

import { AppRootProps } from '@grafana/data';

import { ROUTES } from '../../constants';
import { Logs } from '../../pages';
import { testIds } from '../../testIds';

export function App(props: AppRootProps) {
  return (
    <div data-testid={testIds.container} style={{ marginTop: '5%' }}>
      <Routes>
        <Route path={ROUTES.Logs} element={<Logs />} />

        <Route path={'*'} element={<Logs />} />
      </Routes>
    </div>
  );
}
