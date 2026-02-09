import { screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { initialState } from '@Redux/reducers/authSlice';
import { renderWithProviders } from '@Redux/utils';

import App from './App';

console.error = vi.fn();
console.warn = vi.fn();

const preloadedState = {
  auth: {
    ...initialState,
    isAuthenticated: true,
  },
};

// TODO:  Set auth state as authorized to enable passage to main dashboard.
describe('Initialization', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('App initializes without error or warnings', () => {
    renderWithProviders(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(console.error).toHaveBeenCalledTimes(0);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });
});

describe('Routes; user logged in', () => {
  test('Address "/" defaults to dashboard as index route', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
      { preloadedState }
    );

    // eslint-disable-next-line perfectionist/sort-objects
    const dashboardRoute = screen.getByRole('heading', { level: 1, name: /dashboard/i });

    expect(dashboardRoute).toBeInTheDocument();
  });

  test('Erroneous route defaults back to index route', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/someErroneousRoute']}>
        <App />
      </MemoryRouter>,
      { preloadedState }
    );

    // eslint-disable-next-line perfectionist/sort-objects
    const dashboardRoute = screen.getByRole('heading', { level: 1, name: /dashboard/i });

    expect(dashboardRoute).toBeInTheDocument();
  });
});

describe('Routes; user not authenticated', () => {
  test('All non-designated routes default back to "/login', () => {
    renderWithProviders(
      <MemoryRouter initialEntries={['/someErroneousRoute']}>
        <App />
      </MemoryRouter>
    );

    const loginRoute = screen.getByRole('heading', { level: 1 });

    expect(loginRoute).toHaveTextContent(/sign in/i);
  });
});
