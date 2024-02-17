import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Initialization', () => {
  test('Component should render correctly; contain header and h1 elements', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');
    const H1Element = screen.getByRole('heading', { level: 1 });

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeVisible();
    expect(H1Element).toBeInTheDocument();
    expect(H1Element).toBeVisible();
  });
});
