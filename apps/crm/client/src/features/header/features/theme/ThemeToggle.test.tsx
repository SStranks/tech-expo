import { render, screen } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';
import userEvent from '@testing-library/user-event';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<ThemeToggle />);

    const themeToggleButton = screen.getByRole('button');
    const themeSvg = screen.getByRole('img');

    expect(themeToggleButton).toBeInTheDocument();
    expect(themeToggleButton).toBeVisible();
    expect(themeToggleButton).toContainElement(themeSvg);
  });
});

describe('Functionality', () => {
  test('Theme toggle should add/remove class "dark-theme" to the body element upon click', async () => {
    const { baseElement } = render(<ThemeToggle />);
    const user = userEvent.setup();

    const themeToggleButton = screen.getByRole('button');
    const bodyElement = baseElement;

    expect(bodyElement).not.toHaveClass('dark-theme');
    await user.click(themeToggleButton);
    expect(bodyElement).toHaveClass('dark-theme');
  });
});
