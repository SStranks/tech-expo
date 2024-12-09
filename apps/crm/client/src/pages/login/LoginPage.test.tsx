import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { EMAIL_RULES } from '@Components/react-hook-form/validationRules';
import { renderWithProviders } from '@Redux/utils';

import LoginPage from './LoginPage';

const requestBodyParser = vi.fn();
const handlers = [
  http.post(`http://${process.env.API_HOST}/api/users/login`, async ({ request }) => {
    const body = await request.json();
    requestBodyParser(body);
    return HttpResponse.json({});
  }),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Initialization', () => {
  test('Component should render correctly', () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const headerH1 = screen.getByRole('heading', { name: /sign in/i, level: 1 });
    const formElement = screen.getByRole('form', { name: /sign in/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const rememberCredentialsCheckbox = screen.getByRole('checkbox', { name: /remember credentials/i });
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(headerH1).toBeInTheDocument();
    expect(formElement).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(rememberCredentialsCheckbox).toBeInTheDocument();
    expect(forgotPasswordLink).toBeInTheDocument();
    expect(signInButton).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
  });
});

describe('Functionality', () => {
  test('Form links are valid', () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    const signUpLink = screen.getByRole('link', { name: /sign up/i });

    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password');
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  test('Form; Input validation; empty inputs should not trigger submission', async () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const user = userEvent.setup();

    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.click(signInButton);

    // Submission
    expect(requestBodyParser).not.toHaveBeenCalled();
  });

  test('Form; Input validation; error message on invalid email pattern', async () => {
    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    const user = userEvent.setup();

    const emailInputContainer = screen.getByTestId('email address');
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.click(emailInput);
    await user.keyboard('invalidAddress');
    await user.click(passwordInput);
    await user.keyboard('validpassword');
    await user.click(signInButton);

    expect(emailInputContainer).toHaveTextContent(EMAIL_RULES.pattern.message);

    // Submission
    expect(requestBodyParser).not.toHaveBeenCalled();
  });

  test('Form; Submission success', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const passwordInput = screen.getByLabelText(/password/i);
    const signInButton = screen.getByRole('button', { name: /sign in/i });

    await user.click(emailInput);
    await user.keyboard('admin@admin.com');
    await user.click(passwordInput);
    await user.keyboard('12345');
    await user.click(signInButton);

    expect(screen.queryAllByRole('alert')).toHaveLength(0);

    // Submission
    expect(requestBodyParser).toHaveBeenCalledTimes(1);
    expect(requestBodyParser).toHaveBeenCalledWith({ email: 'admin@admin.com', password: '12345' });
  });
});
