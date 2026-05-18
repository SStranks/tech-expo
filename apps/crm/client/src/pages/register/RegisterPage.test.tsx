import type { LoginResponse } from '@apps/crm-shared';

import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';
import { getStrength } from '@Lib/zxcvbn';
import { MAX_PASSWORD } from '@Tests/consts';
import { mockSuccess } from '@Tests/mocks/api';
import { renderWithAllProviders } from '@Tests/providers';

import RegisterPage from './RegisterPage';

const { EMAIL_RULES, PASSWORD_STRENGTH_RULES } = VALIDATION_MESSAGES;

const navigateMock = vi.fn();

// DEBUG: Can we make a global mock? Appropriate?
vi.mock('@tanstack/react-router', async () => {
  const actual = await vi.importActual('@tanstack/react-router');

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@Lib/zxcvbn', () => ({
  getStrength: vi.fn(),
}));

vi.mock('@Features/password-strength/usePasswordStrength', () => ({
  default: () => 4,
}));

afterEach(() => vi.resetAllMocks());

describe('Initialization', () => {
  test('Component should render correctly', async () => {
    await renderWithAllProviders(<RegisterPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const headerH1 = await screen.findByRole('heading', { name: /register account/i, level: 1 });
    const formElement = screen.getByRole('form', { name: /register account/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordStrengthInput = await screen.findByLabelText(/password/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });
    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(headerH1).toBeInTheDocument();
    expect(formElement).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordStrengthInput).toBeInTheDocument();
    expect(registerAccountButton).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
  });
});

// NOTE: getStrength mock determines password strength (0-3 = weak, 4 = strong) and not any input from 'user.type'
describe('Functionality', () => {
  afterEach(() => vi.resetAllMocks());

  test('Form links are valid', async () => {
    await renderWithAllProviders(<RegisterPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const loginLink = await screen.findByRole('link', { name: /login/i });

    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    vi.mocked(getStrength).mockResolvedValue(0);

    const { serviceHttp } = await renderWithAllProviders(<RegisterPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const loginMock = vi.spyOn(serviceHttp!.account, 'login').mockResolvedValue(mockSuccess({} as LoginResponse));

    const user = userEvent.setup({ delay: null });

    // NOTE: Must wait for Suspense to resolve 'password' input component.
    await screen.findByLabelText(/^password$/i);

    const registerAccountButton = screen.getByRole('button', { name: /register account/i });
    await user.click(registerAccountButton);

    expect(await screen.findByText(EMAIL_RULES.required)).toBeInTheDocument();
    expect(await screen.findByText(PASSWORD_STRENGTH_RULES.required)).toBeInTheDocument();

    expect(loginMock).not.toHaveBeenCalled(); // Form Submission
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    vi.mocked(getStrength).mockResolvedValue(4);

    const { serviceHttp } = await renderWithAllProviders(<RegisterPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const loginMock = vi.spyOn(serviceHttp!.account, 'login').mockResolvedValue(mockSuccess({} as LoginResponse));

    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordStrengthInput = screen.getByTestId(/password-strength-input/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    fireEvent.change(passwordStrengthInput, { target: { value: MAX_PASSWORD } });
    await user.type(emailInput, 'invalidAddress');
    await user.click(registerAccountButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(EMAIL_RULES.pattern);

    expect(loginMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Input validation; error message on invalid password strength', async () => {
    vi.mocked(getStrength).mockResolvedValue(0);

    const { serviceHttp } = await renderWithAllProviders(<RegisterPage />, {
      providers: { withRouter: true, withServices: true },
    });
    const loginMock = vi.spyOn(serviceHttp!.account, 'login').mockResolvedValue(mockSuccess({} as LoginResponse));

    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordStrengthInput = screen.getByTestId(/password-strength-input/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    fireEvent.change(passwordStrengthInput, { target: { value: 'abc' } });
    await user.type(emailInput, 'valid@address.com');
    await user.click(registerAccountButton);

    expect(await screen.findByRole('alert')).toHaveTextContent(PASSWORD_STRENGTH_RULES.validate.strength);

    expect(loginMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Submission success', async () => {
    vi.mocked(getStrength).mockResolvedValue(4);

    const { serviceHttp } = await renderWithAllProviders(<RegisterPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const loginMock = vi.spyOn(serviceHttp!.account, 'login').mockResolvedValue(mockSuccess({} as LoginResponse));

    const user = userEvent.setup({ delay: null });

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordStrengthInput = screen.getByTestId(/password-strength-input/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    fireEvent.change(passwordStrengthInput, { target: { value: MAX_PASSWORD } });
    await user.type(emailInput, 'admin@admin.com');
    await user.click(registerAccountButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    expect(loginMock).toHaveBeenCalledWith({ email: 'admin@admin.com', password: MAX_PASSWORD }); // Form submission
  });
});
