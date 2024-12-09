/* eslint-disable perfectionist/sort-imports */
import { screen } from '@testing-library/react';

import { setupStore } from '@Redux/store';
import { authenticateUser } from '@Redux/reducers/authSlice';
import { renderWithProviders } from '@Redux/utils';

import Authenticate from './Authenticate';

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
    const store = setupStore();
    store.dispatch(authenticateUser(true));

    renderWithProviders(
      <Authenticate fallback={<h1>Fallback</h1>}>
        <h1>Children</h1>
      </Authenticate>,
      { store }
    );

    const headingH1 = screen.getByRole('heading', { level: 1 });

    expect(headingH1).toHaveTextContent('Children');
  });
});
