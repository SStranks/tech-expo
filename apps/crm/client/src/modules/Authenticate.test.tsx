import { screen } from '@testing-library/react';

import { initialState } from '@Redux/reducers/authSlice';
import { renderWithProviders } from '@Redux/utils';

import Authenticate from './Authenticate';

const preloadedState = {
  auth: {
    ...initialState,
    isAuthenticated: true,
  },
};

describe('Initialization', () => {
  test('Component should render correctly; no authentication renders fallback', () => {
    renderWithProviders(
      <Authenticate fallback={<h1>Fallback</h1>}>
        <h1>Children</h1>
      </Authenticate>
    );

    const headingH1 = screen.getByRole('heading', { level: 1 });

    expect(headingH1).toHaveTextContent('Fallback');
  });

  test('Component should render correctly; authentication renders children', () => {
    renderWithProviders(
      <Authenticate fallback={<h1>Fallback</h1>}>
        <h1>Children</h1>
      </Authenticate>,
      { preloadedState }
    );

    const headingH1 = screen.getByRole('heading', { level: 1 });

    expect(headingH1).toHaveTextContent('Children');
  });
});
