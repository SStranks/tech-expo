import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { MAX_PASSWORD } from '@Lib/__mocks__/zxcvbn';
import { usePasswordStrength } from '@Lib/zxcvbn';

import FormProvider from '../form-provider/FormProvider';
import { VALIDATION_MESSAGES } from '../validationRules';
import InputPasswordStrength, { ARIA_LIVE_MESSAGES } from './InputPasswordStrength';

const { PASSWORD_STRENGTH_RULES, PASSWORDCONFIRM_RULES } = VALIDATION_MESSAGES;
const defaultValues = { password: '' };

vi.mock('@Lib/zxcvbn', () => ({
  getStrength: vi.fn(),
  usePasswordStrength: vi.fn(),
}));

afterEach(() => vi.clearAllMocks());

describe('Initialization', () => {
  test('Component should render correctly', async () => {
    render(
      <FormProvider onSubmit={() => ({})}>
        <InputPasswordStrength defaultValue={defaultValues.password} name="password" reveal={false} label="password" />
      </FormProvider>,
      { wrapper: BrowserRouter }
    );

    const passwordInput = await screen.findByLabelText(/password/i);
    const ariaOutputElement = screen.getByTestId('password-strength-status');

    expect(passwordInput).toBeInTheDocument();
    expect(ariaOutputElement).toBeInTheDocument();
    // Element is visibly hidden but accessible to screen readers
    expect(ariaOutputElement).toHaveClass('invisibleAccessible');
  });
});

describe('Functionality', () => {
  test('Empty input should return password strength score of 0', async () => {
    vi.mocked(usePasswordStrength).mockReturnValue(0);
    render(
      <FormProvider onSubmit={() => ({})}>
        <InputPasswordStrength defaultValue={defaultValues.password} name="password" reveal={false} label="password" />
      </FormProvider>,
      { wrapper: BrowserRouter }
    );
    const user = userEvent.setup({ delay: null });

    const passwordInput = screen.getByLabelText(/password/i);
    await user.type(passwordInput, 'a');

    const ariaOutputElement = screen.getByTestId('password-strength-status');

    expect(ariaOutputElement).toHaveTextContent(ARIA_LIVE_MESSAGES[0]);
  });

  test('Maximum strength password should have strength score of 4', async () => {
    vi.mocked(usePasswordStrength).mockReturnValue(4);
    render(
      <FormProvider onSubmit={() => ({})}>
        <InputPasswordStrength defaultValue={defaultValues.password} name="password" reveal={false} label="password" />
      </FormProvider>,
      { wrapper: BrowserRouter }
    );
    const user = userEvent.setup({ delay: null });

    const passwordInput = screen.getByLabelText(/password/i);
    const ariaOutputElement = screen.getByTestId('password-strength-status');

    await user.type(passwordInput, MAX_PASSWORD);

    const alert1 = screen.queryByText(PASSWORD_STRENGTH_RULES.required);
    const alert2 = screen.queryByText(PASSWORDCONFIRM_RULES.required);
    const alert3 = screen.queryByText(PASSWORDCONFIRM_RULES.validate.confirm);
    const alert4 = screen.queryByText(PASSWORD_STRENGTH_RULES.validate.strength);

    expect(alert1).not.toBeInTheDocument();
    expect(alert2).not.toBeInTheDocument();
    expect(alert3).not.toBeInTheDocument();
    expect(alert4).not.toBeInTheDocument();

    expect(ariaOutputElement).toHaveTextContent(ARIA_LIVE_MESSAGES[4]);
  });
});
