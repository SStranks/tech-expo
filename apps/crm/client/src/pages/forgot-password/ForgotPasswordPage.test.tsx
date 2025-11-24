import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';
import serviceHttp from '@Services/serviceHttp';

import ForgotPasswordPage from './ForgotPasswordPage';

const { EMAIL_RULES } = VALIDATION_MESSAGES;

vi.spyOn(serviceHttp, 'accountForgotPassword').mockImplementation(async (data) => data);

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });

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
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });

    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });

    await user.click(resetPasswordButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(1);

    expect(serviceHttp.accountForgotPassword).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });

    await user.click(emailInput);
    await user.keyboard('invalidAddress');
    await user.click(resetPasswordButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(EMAIL_RULES.pattern);

    expect(serviceHttp.accountForgotPassword).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Submission success', async () => {
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });

    await user.click(emailInput);
    await user.keyboard('admin@admin.com');
    await user.click(resetPasswordButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    expect(serviceHttp.accountForgotPassword).toHaveBeenCalledWith({ email: 'admin@admin.com' }); // Form submission
  });
});
