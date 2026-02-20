import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';
import { mockSuccess } from '@Tests/mocks/api';
import { renderWithAllProviders } from '@Tests/providers';

import ForgotPasswordPage from './ForgotPasswordPage';

const { EMAIL_RULES } = VALIDATION_MESSAGES;

describe('Initialization', () => {
  test('Component should render correctly', () => {
    renderWithAllProviders(<ForgotPasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const headerH1 = screen.getByRole('heading', { name: /password reset/i, level: 1 });
    const formElement = screen.getByRole('form', { name: /password reset/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });
    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(headerH1).toBeInTheDocument();
    expect(formElement).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(resetPasswordButton).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });
});

describe('Functionality', () => {
  console.log = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('Form links are valid', () => {
    renderWithAllProviders(<ForgotPasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    const { serviceHttp } = renderWithAllProviders(<ForgotPasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });
    const forgotPasswordMock = vi.spyOn(serviceHttp!.account, 'forgotpassword').mockResolvedValue(mockSuccess({}));
    const user = userEvent.setup({ delay: null });

    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });

    await user.click(resetPasswordButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(1);

    expect(forgotPasswordMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    const { serviceHttp } = renderWithAllProviders(<ForgotPasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });
    const forgotPasswordMock = vi.spyOn(serviceHttp!.account, 'forgotpassword').mockResolvedValue(mockSuccess({}));
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });

    await user.click(emailInput);
    await user.keyboard('invalidAddress');
    await user.click(resetPasswordButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(EMAIL_RULES.pattern);

    expect(forgotPasswordMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Submission success', async () => {
    const { serviceHttp } = renderWithAllProviders(<ForgotPasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });
    const forgotPasswordMock = vi.spyOn(serviceHttp!.account, 'forgotpassword').mockResolvedValue(mockSuccess({}));
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });

    await user.click(emailInput);
    await user.keyboard('admin@admin.com');
    await user.click(resetPasswordButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    expect(forgotPasswordMock).toHaveBeenCalledWith({ email: 'admin@admin.com' }); // Form submission
  });
});
