import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, test, vi } from 'vitest';

import { MAX_PASSWORD } from '@Lib/__mocks__/zxcvbn';

import UpdatePasswordPage from './UpdatePasswordPage';

vi.mock('@Lib/zxcvbn');

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Initialization', () => {
  test('Component should render correctly', async () => {
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });

    const headerH1 = screen.getByRole('heading', { name: /set new password/i, level: 1 });
    const formElement = screen.getByRole('form', { name: /set new password/i });
    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });

    expect(headerH1).toBeInTheDocument();
    expect(formElement).toBeInTheDocument();
    expect(passwordStrengthInput).toBeInTheDocument();
    expect(passwordConfirmInput).toBeInTheDocument();
    expect(updatePasswordButton).toBeInTheDocument();
  });
});

describe('Functionality', () => {
  const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });

    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });
    await user.click(updatePasswordButton);

    const alert1 = await screen.findByText(/please enter strong password/i);
    const alert2 = await screen.findByText(/please enter your new password again/i);

    expect(alert1).toBeInTheDocument();
    expect(alert2).toBeInTheDocument();

    // Submission
    expect(consoleMock).not.toHaveBeenCalled();
  });

  test('Form; Input validation; if confirmed password is incorrect display error', async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });

    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = await screen.findByRole('button', { name: /update password/i });

    await user.click(passwordStrengthInput);
    await user.keyboard(MAX_PASSWORD);
    await user.click(passwordConfirmInput);
    await user.keyboard('abc');
    await user.click(updatePasswordButton);

    const alert1 = screen.queryByText(/please enter strong password/i);
    const alert2 = screen.queryByText(/please enter your new password again/i);
    const alert3 = screen.getByText(/Passwords must be identical/i);

    expect(alert1).not.toBeInTheDocument();
    expect(alert2).not.toBeInTheDocument();
    expect(alert3).toBeInTheDocument();

    // Submission
    expect(consoleMock).not.toHaveBeenCalled();
  });

  test('Form; Submission success', async () => {
    const user = userEvent.setup();
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });

    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });

    await user.click(passwordStrengthInput);
    await user.keyboard(MAX_PASSWORD);
    await user.click(passwordConfirmInput);
    await user.keyboard(MAX_PASSWORD);
    await user.click(updatePasswordButton);

    const alert1 = screen.queryByText(/please enter strong password/i);
    const alert2 = screen.queryByText(/please enter your new password again/i);
    const alert3 = screen.queryByText(/Passwords must be identical/i);

    expect(alert1).not.toBeInTheDocument();
    expect(alert2).not.toBeInTheDocument();
    expect(alert3).not.toBeInTheDocument();

    // Submission
    expect(consoleMock).toHaveBeenCalledTimes(1);
    expect(consoleMock).toHaveBeenLastCalledWith({ confirmPassword: MAX_PASSWORD, newPassword: MAX_PASSWORD });
  });
});
