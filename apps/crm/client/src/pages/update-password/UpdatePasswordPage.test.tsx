import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
/* eslint-disable unicorn/numeric-separators-style */
import { BrowserRouter } from 'react-router-dom';

import UpdatePasswordPage from './UpdatePasswordPage';

const STRONG_PASSWORD = 'a&9Hg2*(lMbs';

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
  console.log = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });
    await user.click(updatePasswordButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(2);
    // Submission
    expect(console.log).not.toHaveBeenCalled();
  });

  test('Form; Input validation; if confirmed password is incorrect display error', async () => {
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });

    await user.click(passwordStrengthInput);
    await user.keyboard(STRONG_PASSWORD);
    await user.click(passwordConfirmInput);
    await user.keyboard('abc');
    await user.click(updatePasswordButton);

    expect(await screen.findByRole('alert')).toHaveTextContent('Passwords must be identical');
    // Submission
    expect(console.log).not.toHaveBeenCalled();
  }, 10000);

  test('Form; Submission success', async () => {
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });

    await user.click(passwordStrengthInput);
    await user.keyboard(STRONG_PASSWORD);
    await user.click(passwordConfirmInput);
    await user.keyboard(STRONG_PASSWORD);
    await user.click(updatePasswordButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    // Submission
    expect(console.log).toHaveBeenCalledWith({ confirmPassword: STRONG_PASSWORD, newPassword: STRONG_PASSWORD });
  }, 10000);
});
