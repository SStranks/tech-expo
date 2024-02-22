import { render, screen } from '@testing-library/react';
import InputPasswordStrength from './InputPasswordStrength';
import userEvent from '@testing-library/user-event';

const register = jest.fn();

beforeEach(() => {
  jest.resetAllMocks();
});

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(
      <InputPasswordStrength register={register} inputName={''} placeholder={''} error={undefined} reveal={false} />
    );

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
    render(
      <InputPasswordStrength register={register} inputName={''} placeholder={''} error={undefined} reveal={false} />
    );
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/password/i);
    await user.click(passwordInput);

    const ariaOutputElement = await screen.findByRole('status');

    expect(ariaOutputElement).toHaveTextContent('Password strength 0 out of 4: Too guessable');
  });

  test('Maximum strength password should have strength score of 4', async () => {
    render(
      <InputPasswordStrength register={register} inputName={''} placeholder={''} error={undefined} reveal={false} />
    );
    const user = userEvent.setup();

    const passwordInput = screen.getByLabelText(/password/i);
    const ariaOutputElement = await screen.findByRole('status');

    await user.click(passwordInput);
    await user.keyboard('s!i0bF$qeVx');

    expect(ariaOutputElement).toHaveTextContent('Password strength 4 out of 4: Very unguessable');
  }, 9000);
});
