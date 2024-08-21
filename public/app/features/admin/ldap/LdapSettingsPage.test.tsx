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

const setup = () => {
  render(
    <TestProvider>
      <LdapSettingsPage/>
    </TestProvider>
  );

  userEvent.setup();
};

describe('LdapSettingsPageTest', () => {
  it('should render LDAP Settings Page', () => {
    setup();

    expect(screen.getByText('documentation')).toBeInTheDocument();
  });
});
