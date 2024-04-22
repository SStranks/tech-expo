import { BrowserRouter } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputPasswordStrength from './InputPasswordStrength';

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Initialization', () => {
  test('Component should render correctly', () => {
    const Component = () => {
      const methods = useForm<{ password: string }>({ defaultValues: { password: '' } });

      return (
        <InputPasswordStrength
          register={methods.register}
          control={methods.control}
          trigger={methods.trigger}
          inputName="password"
          error={undefined}
          isDirty={undefined}
          reveal={false}
          label="password"
        />
      );
    };

    render(<Component />, { wrapper: BrowserRouter });

    const passwordInput = screen.getByLabelText(/password/i);
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
          inputName="password"
          error={undefined}
          isDirty={undefined}
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
          inputName="password"
          error={undefined}
          isDirty={undefined}
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
    await user.keyboard('s!i0bF$qeVx');

    expect(ariaOutputElement).toHaveTextContent('Password strength 4 out of 4: Very unguessable');
  }, 9000);
});
