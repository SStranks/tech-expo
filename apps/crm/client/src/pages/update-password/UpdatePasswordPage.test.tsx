import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, vi } from 'vitest';

import { VALIDATION_MESSAGES } from '@Components/react-hook-form/validationRules';
import { getStrength } from '@Lib/zxcvbn';
import { MAX_PASSWORD, OLD_PASSWORD } from '@Tests/consts';
import { mockSuccess } from '@Tests/mocks/api';

import { renderWithAllProviders } from '../../tests/providers';
import UpdatePasswordPage from './UpdatePasswordPage';

const { PASSWORD_RULES, PASSWORD_STRENGTH_RULES, PASSWORDCONFIRM_RULES } = VALIDATION_MESSAGES;

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
    renderWithAllProviders(<UpdatePasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });

    const headerH1 = screen.getByRole('heading', { name: /set new password/i, level: 1 });
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
  afterEach(() => vi.clearAllMocks());

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    const { serviceHttp } = renderWithAllProviders(<UpdatePasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });
    vi.mocked(getStrength).mockResolvedValue(0);

    const updatePasswordMock = vi
      .spyOn(serviceHttp!.account, 'updatepassword')
      .mockResolvedValue(mockSuccess({ tokens: { tokens: true } }));
    const user = userEvent.setup({ delay: null });

    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });
    await user.click(updatePasswordButton);

    expect(await screen.findByText(PASSWORD_STRENGTH_RULES.required)).toBeInTheDocument();
    expect(await screen.findByText(PASSWORDCONFIRM_RULES.required)).toBeInTheDocument();
    expect(await screen.findByText(PASSWORD_RULES.required)).toBeInTheDocument();

    expect(updatePasswordMock).not.toHaveBeenCalled(); // Form submission
  });

  test('Form; Input validation; if confirmed password is incorrect display error', async () => {
    const { serviceHttp } = renderWithAllProviders(<UpdatePasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });
    vi.mocked(getStrength).mockResolvedValue(4);

    const updatePasswordMock = vi
      .spyOn(serviceHttp!.account, 'updatepassword')
      .mockResolvedValue(mockSuccess({ tokens: { tokens: true } }));
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

    expect(updatePasswordMock).not.toHaveBeenCalled();
  });

  test('Form; Submission success', async () => {
    const { serviceHttp } = renderWithAllProviders(<UpdatePasswordPage />, {
      providers: { withRouter: true, withServices: true },
    });

    vi.mocked(getStrength).mockResolvedValue(4);
    const updatePasswordMock = vi
      .spyOn(serviceHttp!.account, 'updatepassword')
      .mockResolvedValue(mockSuccess({ tokens: { tokens: true } }));
    const user = userEvent.setup({ delay: null });

    const passwordStrengthInput = await screen.findByLabelText(/^password$/i);
    const passwordConfirmInput = await screen.findByLabelText(/^confirm password$/i);
    const updatePasswordButton = screen.getByRole('button', { name: /update password/i });
    const passwordOldInput = await screen.findByLabelText(/^old password$/i);

    await user.type(passwordStrengthInput, MAX_PASSWORD);
    await user.type(passwordConfirmInput, MAX_PASSWORD);
    await user.type(passwordOldInput, OLD_PASSWORD);
    await user.click(updatePasswordButton);

    expect(updatePasswordMock).toHaveBeenCalledTimes(1);
    expect(updatePasswordMock).toHaveBeenLastCalledWith({
      newPassword: MAX_PASSWORD,
      newPasswordConfirm: MAX_PASSWORD,
      oldPassword: OLD_PASSWORD,
    });

    expect(screen.queryByText(PASSWORD_STRENGTH_RULES.required)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORDCONFIRM_RULES.required)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORDCONFIRM_RULES.validate.confirm)).not.toBeInTheDocument();
    expect(screen.queryByText(PASSWORD_RULES.required)).not.toBeInTheDocument();
  });
});
