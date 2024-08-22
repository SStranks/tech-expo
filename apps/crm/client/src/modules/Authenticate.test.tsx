import { render, screen } from '@testing-library/react';
import Authenticate from './Authenticate';

describe('Initialization', () => {
  afterAll(() => {
    // TEMP DEV:  Login functionality as localStorage key-pair
    window.localStorage.removeItem('CRM Login Token');
  });

  test('Component should render correctly; no authentication renders fallback', () => {
    render(
      <Authenticate fallback={<h1>Fallback</h1>}>
        <h1>Children</h1>
      </Authenticate>
    );

    const headingH1 = screen.getByRole('heading', { level: 1 });

    expect(headingH1).toHaveTextContent('Fallback');
  });

  test('Component should render correctly; no authentication renders children', () => {
    // Authentication of user
    window.localStorage.setItem('CRM Login Token', 'Valid');
    render(
      <Authenticate fallback={<h1>Fallback</h1>}>
        <h1>Children</h1>
      </Authenticate>
    );

    const headingH1 = screen.getByRole('heading', { level: 1 });

    expect(headingH1).toHaveTextContent('Children');
  });
});
