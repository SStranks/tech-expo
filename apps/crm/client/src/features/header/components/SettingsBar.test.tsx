import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@Tests/providers';

import SettingsBar from './SettingsBar';

describe('Initialization', () => {
  test('Component should render correctly', async () => {
    await renderWithAllProviders(<SettingsBar />, { providers: { withRedux: true, withRouter: true } });

    const themeSwitchButton = screen.getByRole('button', { name: /theme switch toggle/ });
    const notificationsButton = screen.getByRole('button', { name: /notifications/ });
    const userSettingsButton = screen.getByRole('button', { name: /user settings/ });

    expect(themeSwitchButton).toBeInTheDocument();
    expect(themeSwitchButton).toBeVisible();
    expect(notificationsButton).toBeInTheDocument();
    expect(notificationsButton).toBeVisible();
    expect(userSettingsButton).toBeInTheDocument();
    expect(userSettingsButton).toBeVisible();
  });
});
