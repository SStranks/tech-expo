import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// import { IconCalendar } from '@Components/svg';
import MenuLink from './MenuLink';

const Icon = jest.fn();

describe('Initialization', () => {
  beforeEach(() => {
    jest.resetAllMocks;
  });

  test('Component should render correctly', () => {
    render(<MenuLink name="dashboard" href="/dashboard" Icon={Icon} minimize={false} index={0} />, {
      wrapper: BrowserRouter,
    });

    const listItem = screen.getByRole('listitem');
    const icon = screen.getByLabelText('dashboard', { selector: 'div' });
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
    render(<MenuLink name="dashboard" href="/dashboard" Icon={Icon} minimize={false} index={0} />, {
      wrapper: BrowserRouter,
    });

    const listItem = screen.getByRole('listitem');

    expect(listItem).toHaveClass(/menuLink--maximize/);
    expect(listItem).not.toHaveClass(/menuLink--minimize/);
  });

  test('Minimize prop; true; should apply minimize animation style', () => {
    render(<MenuLink name="dashboard" href="/dashboard" Icon={Icon} minimize={true} index={0} />, {
      wrapper: BrowserRouter,
    });

    const listItem = screen.getByRole('listitem');

    expect(listItem).toHaveClass(/menuLink--minimize/);
    expect(listItem).not.toHaveClass(/menuLink--maximize/);
  });
});
