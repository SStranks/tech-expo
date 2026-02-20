import type { LoginResponse } from '@apps/crm-shared';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';
import { mockSuccess } from '@Tests/mocks/api';
import { renderWithAllProviders } from '@Tests/providers';

import LoginPage from './LoginPage';

const { EMAIL_RULES } = VALIDATION_MESSAGES;

describe('Initialization', () => {
  test('Component should render correctly', () => {
    renderWithAllProviders(<LoginPage />, {
      providers: { withRedux: true, withRouter: true, withServices: true },
    });

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
    renderWithAllProviders(<LoginPage />, {
      providers: { withRedux: true, withRouter: true, withServices: true },
    });

    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  test('Form; Input validation; empty inputs should not trigger submission', async () => {
    const { serviceHttp } = renderWithAllProviders(<LoginPage />, {
      providers: { withRedux: true, withRouter: true, withServices: true },
    });
    const loginMock = vi.spyOn(serviceHttp!.account, 'login').mockResolvedValue(mockSuccess({} as LoginResponse));
    const user = userEvent.setup({ delay: null });

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.click(signInButton);

    expect(loginMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    const { serviceHttp } = renderWithAllProviders(<LoginPage />, {
      providers: { withRedux: true, withRouter: true, withServices: true },
    });
    const loginMock = vi.spyOn(serviceHttp!.account, 'login').mockResolvedValue(mockSuccess({} as LoginResponse));
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email address/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'invalidAddress');
    await user.type(passwordInput, 'validpassword');
    await user.click(signInButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(EMAIL_RULES.pattern);
    expect(loginMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Submission success', async () => {
    const { serviceHttp } = renderWithAllProviders(<LoginPage />, {
      providers: { withRedux: true, withRouter: true, withServices: true },
    });
    const loginMock = vi.spyOn(serviceHttp!.account, 'login').mockResolvedValue(mockSuccess({} as LoginResponse));
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'admin@admin.com');
    await user.type(passwordInput, '12345');
    await user.click(signInButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    expect(loginMock).toHaveBeenCalledTimes(1); // Form submission
    expect(loginMock).toHaveBeenCalledWith({ email: 'admin@admin.com', password: '12345' });
  });
});
