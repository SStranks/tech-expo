import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import Search from './Search';

const setPortalActive = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
});

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<Search portalActive={true} setPortalActive={setPortalActive} />);

    const searchBar = screen.getByRole('search');
    const formElement = screen.getByRole('form', { name: /search crm interface/ });
    const searchInput = screen.getByRole('searchbox');
    const searchFocusIcon = screen.getByTitle('Icon Search', { exact: true });
    const closeIcon = screen.getByTitle('Icon Close', { exact: true });
    const closeButton = screen.getByRole('button');

    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toBeVisible();
    expect(formElement).toBeInTheDocument();
    expect(formElement).toBeVisible();
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeVisible();
    expect(searchFocusIcon).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toContainElement(closeIcon);
  });

  test('Search input field should be autofocused', () => {
    render(<Search portalActive={true} setPortalActive={setPortalActive} />);

    const searchInput = screen.getByRole('searchbox');

    expect(searchInput).toHaveFocus();
  });
});

describe('Functionality', () => {
  test('Pressing "Enter" should submit search input, if input is not empty', async () => {
    render(<Search portalActive={true} setPortalActive={setPortalActive} />);
    const user = userEvent.setup();
    const submitSpy = vi.spyOn(console, 'log');

    const searchInput = screen.getByRole('searchbox');

    // Empty search input
    await user.click(searchInput);
    await user.keyboard('{Enter}');
    expect(submitSpy).toHaveBeenCalledTimes(0);
    // Non-empty search input
    await user.keyboard('User Query');
    await user.keyboard('{Enter}');
    expect(submitSpy).toHaveBeenCalledWith(expect.stringMatching(/search submitted/i));
  });
});
