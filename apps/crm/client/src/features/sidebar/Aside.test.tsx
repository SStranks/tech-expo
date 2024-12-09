import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';

import { Aside, MENU_CATEGORIES } from './Aside';

describe('Initialization', () => {
  test('Sidebar menu contains valid links', () => {
    render(<Aside />, { wrapper: BrowserRouter });

    const links = screen.getAllByRole('link');

    links.forEach((link, i) => {
      const linkText = MENU_CATEGORIES[i][0];
      const linkHref = MENU_CATEGORIES[i][1];
      expect(link).toBeInTheDocument();
      expect(link).toBeVisible();
      expect(link).toHaveTextContent(linkText);
      expect(link).toHaveAttribute('href', `${linkHref}`);
    });
  });

  test('Sidebar menu contains a button to toggle maximize/minimize visibility state', () => {
    render(<Aside />, { wrapper: BrowserRouter });

    const menuToggleButton = screen.getByRole('button', { name: /side-menu collapse toggle/i });

    expect(menuToggleButton).toBeInTheDocument();
    expect(menuToggleButton).toBeVisible();
  });
});

describe('Functionality', () => {
  test('Menu toggle button collapses the sidebar; icons remain visible, text invisible', async () => {
    render(<Aside />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const menuToggleButton = screen.getByRole('button', { name: /side-menu collapse toggle/i });
    const links = screen.getAllByRole('listitem');

    await user.click(menuToggleButton);

    await waitFor(() => {
      links.forEach((link) => {
        expect(link).toHaveClass(/menuLink--minimize/);
      });
    });
  });
});
