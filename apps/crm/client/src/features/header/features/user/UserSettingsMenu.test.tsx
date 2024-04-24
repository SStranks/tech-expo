import { render, screen } from '@testing-library/react';
import UserSettingsMenu from './UserSettingsMenu';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

describe('Initialization', () => {
  test('Component should render correctly; user settings window should not be present before click event', () => {
    render(<UserSettingsMenu userName="Smith" />, { wrapper: BrowserRouter });

    const userSettingsButton = screen.getByRole('button', { name: /user settings menu/ });
    const userSettingsIcon = screen.getByLabelText(/user settings/);
    const userSettingsContentTitle = screen.queryByText(/user settings/i);
    const userSettingsContentUserName = screen.queryByText(/smith/i);

    expect(userSettingsButton).toBeInTheDocument();
    expect(userSettingsButton).toBeVisible();
    expect(userSettingsButton).toContainElement(userSettingsIcon);
    expect(userSettingsContentTitle).not.toBeInTheDocument();
    expect(userSettingsContentUserName).not.toBeInTheDocument();
  });

  test('Component should render correctly; in portal after click event', async () => {
    render(<UserSettingsMenu userName="Smith" />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    // Open portal content
    const userSettingsButton = screen.getByRole('button', { name: /user settings menu/ });
    await user.click(userSettingsButton);

    const userSettingsContentUserNameText = screen.getByText(/smith/i);
    const userSettingsContentSettingsButton = screen.getByRole('button', { name: /^user settings$/i });
    const userSettingsContentLogoutButton = screen.getByRole('button', { name: /logout/i });

    expect(userSettingsContentUserNameText).toBeInTheDocument();
    expect(userSettingsContentSettingsButton).toBeInTheDocument();
    expect(userSettingsContentLogoutButton).toBeInTheDocument();
  });
});
