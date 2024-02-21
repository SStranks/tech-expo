import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import App from './App';

console.error = jest.fn();
console.warn = jest.fn();

describe('Initialization', () => {
  afterEach(() => {
    jest.resetAllMocks;
  });

  test('App initializes without error or warnings', () => {
    render(<App />, { wrapper: BrowserRouter });

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
});

describe('Routes; user logged in', () => {
  beforeAll(() => {
    // TEMP DEV:  Login functionality as localStorage key-pair
    window.localStorage.setItem('CRM Login Token', 'Valid');
  });

  afterAll(() => {
    // TEMP DEV:  Login functionality as localStorage key-pair
    window.localStorage.removeItem('CRM Login Token');
  });

  test('Address "/" defaults to dashboard as index route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    const dashboardRoute = screen.getByText(/dashboard route/i);

    expect(dashboardRoute).toBeInTheDocument();
  });

  test('Erroneous route defaults back to index route', () => {
    render(
      <MemoryRouter initialEntries={['/someErroneousRoute']}>
        <App />
      </MemoryRouter>
    );

    const dashboardRoute = screen.getByText(/dashboard route/i);

    expect(dashboardRoute).toBeInTheDocument();
  });
});

describe('Routes; user not authenticated', () => {
  beforeAll(() => {
    // TEMP DEV:  Login functionality as localStorage key-pair
    window.localStorage.removeItem('CRM Login Token');
  });

  test('All non-designated routes default back to "/login', () => {
    render(
      <MemoryRouter initialEntries={['/someErroneousRoute']}>
        <App />
      </MemoryRouter>
    );

    const loginRoute = screen.getByRole('heading', { level: 1 });

    expect(loginRoute).toHaveTextContent(/sign in/i);
  });
});
