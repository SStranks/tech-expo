import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import SettingsBar from './SettingsBar';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<SettingsBar />, { wrapper: BrowserRouter });

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
