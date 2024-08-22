import { render, screen, waitFor } from 'test/test-utils';

import { PanelModel } from 'app/features/dashboard/state';
import { createDashboardModelFixture } from 'app/features/dashboard/state/__fixtures__/dashboardFixtures';

import * as analytics from '../../Analytics';

import { NewRuleFromPanelButton } from './NewRuleFromPanelButton';

jest.spyOn(analytics, 'logInfo');

jest.mock('react-use', () => ({
  ...jest.requireActual('react-use'),
  useAsync: () => ({ loading: false, value: {} }),
}));

describe('Analytics', () => {
  it('Sends log info when creating an alert rule from a panel', async () => {
    const panel = new PanelModel({
      id: 123,
    });
    const dashboard = createDashboardModelFixture({
      id: 1,
    });
    const { user } = render(<NewRuleFromPanelButton panel={panel} dashboard={dashboard} />);

    const button = screen.getByText('New alert rule');

    button.addEventListener('click', (event) => event.preventDefault(), false);

    await user.click(button);

    await waitFor(() => expect(analytics.logInfo).toHaveBeenCalledWith(analytics.LogMessages.alertRuleFromPanel));
  });
});
