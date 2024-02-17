import { render, screen } from '@testing-library/react';
import UserSettings from './UserSettings';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<UserSettings />);

    const userSettingsButton = screen.getByRole('button', { name: /user settings/ });
    const userSettingsIcon = screen.getByLabelText(/user settings/);

    expect(userSettingsButton).toBeInTheDocument();
    expect(userSettingsButton).toBeVisible();
    expect(userSettingsButton).toContainElement(userSettingsIcon);
  });
});
