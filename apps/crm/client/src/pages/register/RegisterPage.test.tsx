import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';
import { MAX_PASSWORD } from '@Lib/__mocks__/zxcvbn';
import { getStrength } from '@Lib/zxcvbn';
import serviceHttp from '@Services/serviceHttp';

import RegisterPage from './RegisterPage';

const { EMAIL_RULES, PASSWORD_STRENGTH_RULES } = VALIDATION_MESSAGES;

vi.mock('@Lib/zxcvbn', () => ({
  getStrength: vi.fn(),
  usePasswordStrength: vi.fn(),
}));

// Resolve lazy-load immediately
vi.mock('@Components/react-hook-form/input-password/InputPasswordStrength', async (importOriginal) => {
  const actual = await importOriginal();
  return actual;
});

vi.spyOn(serviceHttp, 'accountLogin').mockImplementation(async (data) => data);

afterEach(() => vi.clearAllMocks());

describe('Initialization', () => {
  test('Component should render correctly', async () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    const headerH1 = screen.getByRole('heading', { name: /register account/i, level: 1 });
    const formElement = screen.getByRole('form', { name: /register account/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });
    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(headerH1).toBeInTheDocument();
    expect(formElement).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(registerAccountButton).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });
});

// NOTE: getStrength mock determines password strength (0-3 = weak, 4 = strong) and not any input from 'user.type'
describe('Functionality', () => {
  afterEach(() => vi.clearAllMocks());

  test('Form links are valid', async () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });

    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    vi.mocked(getStrength).mockResolvedValue(null);
    render(<RegisterPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const registerAccountButton = screen.getByRole('button', { name: /register account/i });
    await user.click(registerAccountButton);

    expect(await screen.findByText(EMAIL_RULES.required)).toBeInTheDocument();
    expect(await screen.findByText(PASSWORD_STRENGTH_RULES.required)).toBeInTheDocument();
    expect(serviceHttp.accountLogin).not.toHaveBeenCalled(); // Form Submission
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    vi.mocked(getStrength).mockResolvedValue(4);
    render(<RegisterPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByTestId(/password-strength-input/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    await user.type(emailInput, 'invalidAddress');
    await user.type(passwordInput, MAX_PASSWORD);
    await user.click(registerAccountButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(EMAIL_RULES.pattern);
    expect(serviceHttp.accountLogin).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Input validation; error message on invalid password strength', async () => {
    vi.mocked(getStrength).mockResolvedValue(0);
    render(<RegisterPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByTestId(/password-strength-input/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    await user.type(emailInput, 'valid@address.com');
    await user.type(passwordInput, 'a');
    await user.click(registerAccountButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(PASSWORD_STRENGTH_RULES.validate.strength);
    expect(serviceHttp.accountLogin).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Submission success', async () => {
    vi.mocked(getStrength).mockResolvedValue(4);
    render(<RegisterPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByTestId(/password-strength-input/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    await user.type(emailInput, 'admin@admin.com');
    await user.type(passwordInput, MAX_PASSWORD);
    await user.click(registerAccountButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);
    expect(serviceHttp.accountLogin).toHaveBeenCalledWith({ email: 'admin@admin.com', password: MAX_PASSWORD }); // Form submission
  });
});
