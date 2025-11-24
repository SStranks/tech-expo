import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';
import { renderWithProviders } from '@Redux/utils';
import serviceHttp from '@Services/serviceHttp';

import LoginPage from './LoginPage';

const { EMAIL_RULES } = VALIDATION_MESSAGES;

vi.spyOn(serviceHttp, 'accountLogin').mockImplementation(async (data) => data);

describe('Initialization', () => {
  test('Component should render correctly', () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

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
  test('Form links are valid', () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  test('Form; Input validation; empty inputs should not trigger submission', async () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const user = userEvent.setup({ delay: null });

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.click(signInButton);

    expect(serviceHttp.accountLogin).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalidAddress');
    await user.type(passwordInput, 'validpassword');
    await user.click(signInButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(EMAIL_RULES.pattern);
    expect(serviceHttp.accountLogin).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Submission success', async () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'admin@admin.com');
    await user.type(passwordInput, '12345');
    await user.click(signInButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    expect(serviceHttp.accountLogin).toHaveBeenCalledTimes(1); // Form submission
    expect(serviceHttp.accountLogin).toHaveBeenCalledWith({ email: 'admin@admin.com', password: '12345' });
  });
});
