import { render, screen } from '@testing-library/react';
import MenuLink from './MenuLink';
import { BrowserRouter } from 'react-router-dom';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<MenuLink name="dashboard" href="/dashboard" icon="" minimize={false} index={0} />, {
      wrapper: BrowserRouter,
    });

    const listItem = screen.getByRole('listitem');
    const icon = screen.getByAltText('dashboard');
    const link = screen.getByRole('link');
    const linkText = screen.getByText('dashboard');

    expect(listItem).toBeInTheDocument();
    expect(listItem).toBeVisible();
    expect(icon).toBeInTheDocument();
    expect(icon).toBeVisible();
    expect(link).toBeInTheDocument();
    expect(link).toBeVisible();
    expect(link).toContainElement(linkText);
    expect(link).toHaveAttribute('href', '/dashboard');
    expect(linkText).toBeVisible();
  });

  test('Minimize prop; false; should apply maximize animation style', () => {
    render(<MenuLink name="dashboard" href="/dashboard" icon="" minimize={false} index={0} />, {
      wrapper: BrowserRouter,
    });

    const listItem = screen.getByRole('listitem');

    expect(listItem).toHaveClass(/menuLink--maximize/);
    expect(listItem).not.toHaveClass(/menuLink--minimize/);
  });

  test('Minimize prop; true; should apply minimize animation style', () => {
    render(<MenuLink name="dashboard" href="/dashboard" icon="" minimize={true} index={0} />, {
      wrapper: BrowserRouter,
    });

    const listItem = screen.getByRole('listitem');

    expect(listItem).toHaveClass(/menuLink--minimize/);
    expect(listItem).not.toHaveClass(/menuLink--maximize/);
  });
});
