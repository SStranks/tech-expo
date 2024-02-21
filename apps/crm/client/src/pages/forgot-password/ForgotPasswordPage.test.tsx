import { render, screen } from '@testing-library/react';
import ForgotPasswordPage from './ForgotPasswordPage';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });

    const headerH1 = screen.getByRole('heading', { level: 1, name: /password reset/i });
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
  console.log = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Form links are valid', () => {
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });

    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });

    await user.click(resetPasswordButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(1);

    // Submission
    expect(console.log).not.toHaveBeenCalled();
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });

    emailInput.focus();
    await user.keyboard('invalidAddress');
    await user.click(resetPasswordButton);

    expect(await screen.findByRole('alert')).toHaveTextContent('Entered value does not match email format');

    // Submission
    expect(console.log).not.toHaveBeenCalled();
  });

  test('Form; Submission success', async () => {
    render(<ForgotPasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const resetPasswordButton = screen.getByRole('button', { name: /email reset instructions/i });

    emailInput.focus();
    await user.keyboard('admin@admin.com');
    await user.click(resetPasswordButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    // Submission
    expect(console.log).toHaveBeenCalledWith({ email: 'admin@admin.com' });
  });
});
