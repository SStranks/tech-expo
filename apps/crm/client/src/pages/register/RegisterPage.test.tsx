import { render, screen } from '@testing-library/react';
import RegisterPage from './RegisterPage';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });

    const headerH1 = screen.getByRole('heading', { level: 1, name: /register account/i });
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

describe('Functionality', () => {
  console.log = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('Form links are valid', () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });

    const loginLink = screen.getByRole('link', { name: /login/i });

    expect(loginLink).toHaveAttribute('href', '/login');
  });

  test('Form; Input validation; "required" errors on empty inputs', async () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    await user.click(registerAccountButton);

    expect(await screen.findAllByRole('alert')).toHaveLength(2);

    // Submission
    expect(console.log).not.toHaveBeenCalled();
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    emailInput.focus();
    await user.keyboard('invalidAddress');
    passwordInput.focus();
    await user.keyboard('validpassword');
    await user.click(registerAccountButton);

    expect(await screen.findByRole('alert')).toHaveTextContent('Entered value does not match email format');

    // Submission
    expect(console.log).not.toHaveBeenCalled();
  });

  test('Form; Input validation; error message on invalid password', async () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    passwordInput.focus();
    await user.keyboard('abc');
    emailInput.focus();
    await user.keyboard('valid@address.com');
    await user.click(registerAccountButton);

    expect(await screen.findByRole('alert')).toHaveTextContent('Minimum length; 5 characters');

    // Submission
    expect(console.log).not.toHaveBeenCalled();
  });

  test('Form; Submission success', async () => {
    render(<RegisterPage />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const registerAccountButton = screen.getByRole('button', { name: /register account/i });

    emailInput.focus();
    await user.keyboard('admin@admin.com');
    passwordInput.focus();
    await user.keyboard('12345');
    await user.click(registerAccountButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    // Submission
    expect(console.log).toHaveBeenCalledWith({ email: 'admin@admin.com', password: '12345' });
  });
});
