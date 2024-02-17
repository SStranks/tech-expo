import { render, screen } from '@testing-library/react';
import Main from './Main';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<Main />);

    const mainElement = screen.getByRole('main');

    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toBeVisible();
  });
});
