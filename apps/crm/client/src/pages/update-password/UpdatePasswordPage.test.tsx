import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, test, vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';
import { MAX_PASSWORD } from '@Lib/__mocks__/zxcvbn';
import { getStrength } from '@Lib/zxcvbn';

import UpdatePasswordPage from './UpdatePasswordPage';

const updatePasswordMock = vi.fn();
vi.mock('@Services/serviceHttp', () => {
  return {
    ServiceHttp: vi.fn().mockImplementation(() => ({
      account: {
        updatepassword: updatePasswordMock,
      },
    })),
  };
});

const { PASSWORD_STRENGTH_RULES, PASSWORDCONFIRM_RULES } = VALIDATION_MESSAGES;

vi.mock('@Lib/zxcvbn', () => ({
  getStrength: vi.fn(),
  usePasswordStrength: vi.fn(),
}));

// Resolve lazy-load immediately
vi.mock('@Components/react-hook-form/input-password/InputPasswordStrength', async (importOriginal) => {
  const actual = await importOriginal();
  return actual;
});

afterEach(() => vi.clearAllMocks());

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
  afterEach(() => vi.clearAllMocks());

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    vi.mocked(getStrength).mockResolvedValue(0);
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });
    await user.click(updatePasswordButton);

    expect(await screen.findByText(PASSWORD_STRENGTH_RULES.required)).toBeInTheDocument();
    expect(await screen.findByText(PASSWORDCONFIRM_RULES.required)).toBeInTheDocument();

    expect(updatePasswordMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Input validation; if confirmed password is incorrect display error', async () => {
    vi.mocked(getStrength).mockResolvedValue(4);
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = await screen.findByRole('button', { name: /update password/i });

    await user.type(passwordStrengthInput, MAX_PASSWORD);
    await user.type(passwordConfirmInput, 'abc');
    await user.click(updatePasswordButton);

    expect(screen.queryByText(PASSWORD_STRENGTH_RULES.required)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORDCONFIRM_RULES.required)).not.toBeInTheDocument();
    expect(screen.getByText(PASSWORDCONFIRM_RULES.validate.confirm)).toBeInTheDocument();

    expect(updatePasswordMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Submission success', async () => {
    vi.mocked(getStrength).mockResolvedValue(4);
    render(<UpdatePasswordPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup({ delay: null });

    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });

    await user.type(passwordStrengthInput, MAX_PASSWORD);
    await user.type(passwordConfirmInput, MAX_PASSWORD);
    await user.click(updatePasswordButton);

    expect(screen.queryByText(PASSWORD_STRENGTH_RULES.required)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORDCONFIRM_RULES.required)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORDCONFIRM_RULES.validate.confirm)).not.toBeInTheDocument();

    expect(updatePasswordMock).toHaveBeenCalledTimes(1); // Form submission
    expect(updatePasswordMock).toHaveBeenLastCalledWith({
      'confirm-password': MAX_PASSWORD,
      'new-password': MAX_PASSWORD,
    });
  });
});
