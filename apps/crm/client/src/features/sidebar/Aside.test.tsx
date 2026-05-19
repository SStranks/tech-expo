import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { renderWithAllProviders } from '@Tests/providers';

import { Aside, MENU_CATEGORIES } from './Aside';

describe('Initialization', () => {
  test('Sidebar menu contains valid links', async () => {
    await renderWithAllProviders(<Aside />, { providers: { withRouter: true } });

    const links = await screen.findAllByRole('link');
    expect(links).toHaveLength(MENU_CATEGORIES.length);

    MENU_CATEGORIES.forEach(([text, href], i) => {
      expect(links[i]).toBeInTheDocument();
      expect(links[i]).toBeVisible();
      expect(links[i]).toHaveTextContent(text);
      expect(links[i]).toHaveAttribute('href', href);
    });
  });

  test('Sidebar menu contains a button to toggle maximize/minimize visibility state', async () => {
    await renderWithAllProviders(<Aside />, { providers: { withRouter: true } });

    const menuToggleButton = await screen.findByRole('button', { name: /side-menu collapse toggle/i });

    expect(menuToggleButton).toBeInTheDocument();
    expect(menuToggleButton).toBeVisible();
  });
});

describe('Functionality', () => {
  test('Menu toggle button collapses the sidebar; icons remain visible, text invisible', async () => {
    await renderWithAllProviders(<Aside />, { providers: { withRouter: true } });

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
