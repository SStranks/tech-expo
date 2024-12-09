import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, vi } from 'vitest';

import { MAX_PASSWORD } from '@Lib/__mocks__/zxcvbn';

import InputPasswordStrength from './InputPasswordStrength';

vi.mock('@Lib/zxcvbn');

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Initialization', () => {
  test('Component should render correctly', async () => {
    const Component = () => {
      const methods = useForm<{ password: string }>({ defaultValues: { password: '' } });

      return (
        <InputPasswordStrength
          register={methods.register}
          control={methods.control}
          trigger={methods.trigger}
          defaultValue={methods.formState.defaultValues?.password}
          invalid={methods.getFieldState('password').invalid}
          inputName="password"
          error={undefined}
          isDirty={undefined}
          isRequired={true}
          isSubmitted={methods.formState.isSubmitted}
          reveal={false}
          label="password"
        />
      );
    };

    render(<Component />, { wrapper: BrowserRouter });

    const passwordInput = await screen.findByLabelText(/password/i);
    const ariaOutputElement = screen.getByRole('status');

    expect(passwordInput).toBeInTheDocument();
    expect(ariaOutputElement).toBeInTheDocument();
    // Element is visibly hidden but accessible to screen readers
    expect(ariaOutputElement).toHaveClass('invisibleAccessible');
  });
});

describe('Functionality', () => {
  test('Empty input should return password strength score of 0', async () => {
    const Component = () => {
      const methods = useForm<{ password: string }>({ defaultValues: { password: '' } });

      return (
        <InputPasswordStrength
          register={methods.register}
          control={methods.control}
          trigger={methods.trigger}
          defaultValue={methods.formState.defaultValues?.password}
          invalid={methods.getFieldState('password').invalid}
          inputName="password"
          error={undefined}
          isDirty={undefined}
          isRequired={true}
          isSubmitted={methods.formState.isSubmitted}
          reveal={false}
          label="password"
        />
      );
    };

    render(<Component />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/password/i);
    await user.click(passwordInput);

    const ariaOutputElement = await screen.findByRole('status');

    expect(ariaOutputElement).toHaveTextContent('Password strength 0 out of 4: Too guessable');
  });

  test('Maximum strength password should have strength score of 4', async () => {
    const Component = () => {
      const methods = useForm<{ password: string }>({ defaultValues: { password: '' } });

      return (
        <InputPasswordStrength
          register={methods.register}
          control={methods.control}
          trigger={methods.trigger}
          defaultValue={methods.formState.defaultValues?.password}
          invalid={methods.getFieldState('password').invalid}
          inputName="password"
          error={undefined}
          isDirty={undefined}
          isRequired={true}
          isSubmitted={methods.formState.isSubmitted}
          reveal={false}
          label="password"
        />
      );
    };

    render(<Component />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/password/i);
    const ariaOutputElement = await screen.findByRole('status');

    await user.click(passwordInput);
    await user.keyboard(MAX_PASSWORD);

    const alert1 = screen.queryByText(/please enter strong password/i);
    const alert2 = screen.queryByText(/please enter your new password again/i);
    const alert3 = screen.queryByText(/passwords must be identical/i);
    const alert4 = screen.queryByText(/password is insufficiently strong/i);

    expect(alert1).not.toBeInTheDocument();
    expect(alert2).not.toBeInTheDocument();
    expect(alert3).not.toBeInTheDocument();
    expect(alert4).not.toBeInTheDocument();

    expect(ariaOutputElement).toHaveTextContent('Password strength 4 out of 4: Very unguessable');
  });
});
