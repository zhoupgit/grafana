import { render, screen, waitFor } from 'test/test-utils';

import * as analytics from '../../Analytics';

import { MatcherFilter } from './MatcherFilter';

const logInfoSpy = jest.spyOn(analytics, 'logInfo');

describe('Analytics', () => {
  it('Sends log info when filtering alert instances by label', async () => {
    const { user } = render(<MatcherFilter onFilterChange={jest.fn()} />);

    const searchInput = screen.getByTestId('search-query-input');
    await user.type(searchInput, 'job=');

    await waitFor(() => expect(logInfoSpy).toHaveBeenCalledWith(analytics.LogMessages.filterByLabel));
  });

  it('should call onChange handler', async () => {
    const onFilterMock = jest.fn();

    const { user } = render(<MatcherFilter defaultQueryString="foo" onFilterChange={onFilterMock} />);

    const searchInput = screen.getByTestId('search-query-input');
    await user.type(searchInput, '=bar');

    await waitFor(() => expect(onFilterMock).toHaveBeenLastCalledWith('foo=bar'));
  });
});
