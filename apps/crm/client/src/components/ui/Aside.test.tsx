/* eslint-disable jest/no-commented-out-tests */
import { BrowserRouter } from 'react-router-dom';
import { userEvent } from '@testing-library/user-event';
import { render, screen, waitFor } from '@testing-library/react';
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

    const menuToggleButton = screen.getByRole('button', { name: /menutoggle/i });

    expect(menuToggleButton).toBeInTheDocument();
    expect(menuToggleButton).toBeVisible();
  });
});

describe('Functionality', () => {
  test('Menu toggle button collapses the sidebar; only icons remain visible', async () => {
    render(<Aside />, { wrapper: BrowserRouter });
    const user = userEvent.setup();

    const menuToggleButton = screen.getByRole('button', { name: /menutoggle/i });
    const links = screen.getAllByRole('link');

    await user.click(menuToggleButton);

    await waitFor(() => {
      links.forEach((link) => {
        expect(screen.queryByText(link.textContent!)).not.toBeVisible();
      });
    });
  });

  // NOTE:  Put test for Menu Link hover test in link-subcomponent.
  test('Menu toggle button reveals tooltip upon hover interaction', async () => {
    const user = userEvent.setup();
    render(<Aside />, { wrapper: BrowserRouter });

    const menuToggleButton = screen.getByRole('button', { name: /menutoggle/i });
    const menuToggleButtonHoverTextOpen = 'Minimize Menu';
    const menuToggleButtonHoverTextClosed = 'Maximize Menu';

    // Aside menu in its maximized state
    user.hover(menuToggleButton);
    await screen.findByText(menuToggleButtonHoverTextOpen);
    expect(screen.getByText(menuToggleButtonHoverTextOpen)).toBeVisible();

    // Toggle Menu
    user.click(menuToggleButton);

    // Aside menu in its minimized state
    user.hover(menuToggleButton);
    await screen.findByText(menuToggleButtonHoverTextClosed);
    expect(screen.getByText(menuToggleButtonHoverTextClosed)).toBeVisible();
  });
});
