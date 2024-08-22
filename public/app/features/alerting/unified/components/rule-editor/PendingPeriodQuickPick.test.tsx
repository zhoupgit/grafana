import { render, screen } from 'test/test-utils';

import { PendingPeriodQuickPick } from './PendingPeriodQuickPick';

describe('PendingPeriodQuickPick', () => {
  it('should render the correct default preset, set active element and allow selecting other options', async () => {
    const onSelect = jest.fn();
    const { user } = render(
      <PendingPeriodQuickPick onSelect={onSelect} groupEvaluationInterval={'1m'} selectedPendingPeriod={'2m'} />
    );

    const shouldHaveButtons = ['None', '1m', '2m', '3m', '4m', '5m'];
    const shouldNotHaveButtons = ['0s', '10s', '6m'];

    shouldHaveButtons.forEach((name) => {
      expect(screen.getByRole('option', { name })).toBeInTheDocument();
    });

    shouldNotHaveButtons.forEach((name) => {
      expect(screen.queryByRole('option', { name })).not.toBeInTheDocument();
    });

    expect(screen.getByRole('option', { selected: true })).toHaveTextContent('2m');

    await user.click(screen.getByRole('option', { name: '3m' }));
    expect(onSelect).toHaveBeenCalledWith('3m');

    await user.click(screen.getByRole('option', { name: 'None' }));
    expect(onSelect).toHaveBeenCalledWith('0s');
  });
});
