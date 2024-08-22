import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { backendSrv } from "app/core/services/backend_srv";
import { TestProvider } from "test/helpers/TestProvider";

import LdapSettingsPage from "./LdapSettingsPage";

jest.mock('@grafana/runtime', () => ({
  ...jest.requireActual('@grafana/runtime'),
  getBackendSrv: () => backendSrv,
}));

jest.mock('@grafana/runtime/src/config', () => ({
  config: {
    ...jest.requireActual('@grafana/runtime/src/config').config,
    featureToggles: {
      ssoSettingsLDAP: true,
    },
  },
}));

const setup = (jsx: React.JSX.Element) => {
  return {
    user: userEvent.setup(),
    ...render(
      <TestProvider>
        {jsx}
      </TestProvider>
    )
  };
};

describe('LdapSettingsPageTest', () => {
  it('should render LDAP Settings Page', async () => {
    const {user} = setup(<LdapSettingsPage/>);
    await new Promise(process.nextTick);

    await user.click(screen.getByText('Save'));

    // await expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();

    // await waitFor(() => expect(screen.getByText('Basic Settings')).toBeInTheDocument());
    // await waitFor(() => expect(screen.getByText('Server host')).toBeInTheDocument());

    // await expect(screen.getByText('Basic Settings')).toBeInTheDocument();
    // await expect(screen.getByText('Server host')).toBeInTheDocument();
    // expect(screen.getByText('Base DN')).toBeInTheDocument();
    // expect(screen.getByText('Bind password')).toBeInTheDocument();
    // expect(screen.getByText('Search filter*')).toBeInTheDocument();
    // expect(screen.getByText('Search nase DNS *')).toBeInTheDocument();
  });
});
