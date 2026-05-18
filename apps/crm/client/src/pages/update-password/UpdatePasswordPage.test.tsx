import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';
import { getStrength } from '@Lib/zxcvbn';
import { MAX_PASSWORD, OLD_PASSWORD } from '@Tests/consts';
import { mockSuccess } from '@Tests/mocks/api';

import { renderWithAllProviders } from '../../tests/providers';
import UpdatePasswordPage from './UpdatePasswordPage';

const { PASSWORD_RULES, PASSWORD_STRENGTH_RULES, PASSWORDCONFIRM_RULES } = VALIDATION_MESSAGES;

const navigateMock = vi.fn();

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
    await renderWithAllProviders(<UpdatePasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const headerH1 = await screen.findByRole('heading', { name: /set new password/i, level: 1 });
    const formElement = screen.getByRole('form', { name: /set new password/i });
    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const passwordOldInput = await screen.findByLabelText(/^old password$/i);
    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });

    expect(headerH1).toBeInTheDocument();
    expect(formElement).toBeInTheDocument();
    expect(passwordStrengthInput).toBeInTheDocument();
    expect(passwordConfirmInput).toBeInTheDocument();
    expect(passwordOldInput).toBeInTheDocument();
    expect(updatePasswordButton).toBeInTheDocument();
  });
});

describe('Functionality', () => {
  afterEach(() => vi.resetAllMocks());

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    vi.mocked(getStrength).mockResolvedValue(0);

    const { serviceHttp } = await renderWithAllProviders(<UpdatePasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const updatePasswordMock = vi
      .spyOn(serviceHttp!.account, 'updatepassword')
      .mockResolvedValue(mockSuccess({ tokens: { tokens: true } }));
    const user = userEvent.setup({ delay: null });

    // NOTE: Must wait for Suspense to resolve 'password' input component.
    await screen.findByLabelText(/^password$/i);

    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });
    await user.click(updatePasswordButton);

    expect(await screen.findByText(PASSWORD_STRENGTH_RULES.required)).toBeInTheDocument();
    expect(await screen.findByText(PASSWORDCONFIRM_RULES.required)).toBeInTheDocument();
    expect(await screen.findByText(PASSWORD_RULES.required)).toBeInTheDocument();

    expect(updatePasswordMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Input validation; if confirmed password is incorrect display error', async () => {
    vi.mocked(getStrength).mockResolvedValue(4);

    const { serviceHttp } = await renderWithAllProviders(<UpdatePasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const updatePasswordMock = vi
      .spyOn(serviceHttp!.account, 'updatepassword')
      .mockResolvedValue(mockSuccess({ tokens: { tokens: true } }));
    const user = userEvent.setup({ delay: null });

    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = await screen.findByRole('button', { name: /update password/i });
    const passwordOldInput = await screen.findByLabelText(/^old password$/i);

    fireEvent.change(passwordStrengthInput, { target: { value: MAX_PASSWORD } });
    await user.type(passwordConfirmInput, 'abc');
    await user.type(passwordOldInput, OLD_PASSWORD);
    await user.click(updatePasswordButton);

    expect(screen.queryByText(PASSWORD_STRENGTH_RULES.required)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORDCONFIRM_RULES.required)).not.toBeInTheDocument();
    expect(screen.getByText(PASSWORDCONFIRM_RULES.validate.confirm)).toBeInTheDocument();

    expect(updatePasswordMock).not.toHaveBeenCalled();
  });

  test('Form; Submission success', async () => {
    vi.mocked(getStrength).mockResolvedValue(4);

    const { serviceHttp } = await renderWithAllProviders(<UpdatePasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const updatePasswordMock = vi
      .spyOn(serviceHttp!.account, 'updatepassword')
      .mockResolvedValue(mockSuccess({ tokens: { tokens: true } }));

    const user = userEvent.setup({ delay: null });

    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });
    const passwordOldInput = await screen.findByLabelText(/^old password$/i);

    fireEvent.change(passwordStrengthInput, { target: { value: MAX_PASSWORD } });
    await user.type(passwordConfirmInput, MAX_PASSWORD);
    await user.type(passwordOldInput, OLD_PASSWORD);
    await user.click(updatePasswordButton);

    expect(passwordStrengthInput).toHaveValue(MAX_PASSWORD);
    expect(passwordConfirmInput).toHaveValue(MAX_PASSWORD);
    expect(passwordOldInput).toHaveValue(OLD_PASSWORD);

    expect(screen.queryByText(PASSWORD_STRENGTH_RULES.required)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORDCONFIRM_RULES.required)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORDCONFIRM_RULES.validate.confirm)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORD_RULES.required)).not.toBeInTheDocument();

    expect(updatePasswordMock).toHaveBeenCalledTimes(1);
    expect(updatePasswordMock).toHaveBeenLastCalledWith({
      newPassword: MAX_PASSWORD,
      newPasswordConfirm: MAX_PASSWORD,
      oldPassword: OLD_PASSWORD,
    });
    expect(navigateMock).toHaveBeenCalledWith({ to: '/login' });
  });
});
