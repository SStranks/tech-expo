import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { EMAIL_RULES } from '#Components/react-hook-form/validationRules';

import LoginPage from './LoginPage';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<LoginPage />, { wrapper: BrowserRouter });

    const headerH1 = screen.getByRole('heading', { name: /sign in/i, level: 1 });
    const formElement = screen.getByRole('form', { name: /sign in/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const rememberCredentialsCheckbox = screen.getByRole('checkbox', { name: /remember credentials/i });
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(headerH1).toBeInTheDocument();
    expect(formElement).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(rememberCredentialsCheckbox).toBeInTheDocument();
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
  });
});

describe('Functionality', () => {
  console.log = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Form links are valid', () => {
    render(<LoginPage />, { wrapper: BrowserRouter });

    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.click(signInButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(2);
    // Submission
    expect(console.log).not.toHaveBeenCalled();
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    emailInput.focus();
    await user.keyboard('invalidAddress');
    passwordInput.focus();
    await user.keyboard('validpassword');
    await user.click(signInButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(EMAIL_RULES.pattern.message);

    // Submission
    expect(console.log).not.toHaveBeenCalled();
  });

  test('Form; Submission success', async () => {
    render(<LoginPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    emailInput.focus();
    await user.keyboard('admin@admin.com');
    passwordInput.focus();
    await user.keyboard('12345');
    await user.click(signInButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    // Submission
    expect(console.log).toHaveBeenCalledWith({ email: 'admin@admin.com', password: '12345' });
  });
});
