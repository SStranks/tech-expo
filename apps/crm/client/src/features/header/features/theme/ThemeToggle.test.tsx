import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithProviders } from '@Redux/utils';

import ThemeToggle, { LOCALSTORAGE_TOKEN } from './ThemeToggle';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    renderWithProviders(<ThemeToggle />);

    const themeToggleButton = screen.getByRole('button');
    const themeSvg = screen.getByRole('img');

    expect(themeToggleButton).toBeInTheDocument();
    expect(themeToggleButton).toBeVisible();
    expect(themeToggleButton).toContainElement(themeSvg);
  });
});

describe('Functionality', () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  afterEach(() => {
    document.body.className = '';
  });

  test('Theme toggle should add/remove class "dark-theme" to the body element upon click', async () => {
    const { baseElement } = renderWithProviders(<ThemeToggle />);
    globalThis.dispatchEvent(new Event('load'));
    const user = userEvent.setup();

    const themeToggleButton = screen.getByRole('button');
    const bodyElement = baseElement;

    expect(bodyElement).not.toHaveClass('dark-theme');
    await user.click(themeToggleButton);
    expect(bodyElement).toHaveClass('dark-theme');
  });

  test('If local storage token for theme preference is set; set theme to dark', () => {
    // Set localStorage token for theme
    globalThis.localStorage.setItem(LOCALSTORAGE_TOKEN, 'true');
    const { baseElement } = renderWithProviders(<ThemeToggle />);
    // Component requires page load to trigger useEffect
    globalThis.dispatchEvent(new Event('load'));

    const bodyElement = baseElement;
    expect(bodyElement).toHaveClass('dark-theme');
  });

  test('If local storage token for theme preference is set; set theme to light', () => {
    // Set localStorage token for theme
    globalThis.localStorage.setItem(LOCALSTORAGE_TOKEN, 'false');
    const { baseElement } = renderWithProviders(<ThemeToggle />);
    // Component requires page load to trigger useEffect
    globalThis.dispatchEvent(new Event('load'));

    const bodyElement = baseElement;
    expect(bodyElement).not.toHaveClass('dark-theme');
  });
});
