import { screen } from '@testing-library/react';

import { renderWithAllProviders } from '@Tests/providers';

import Header from './Header';

describe('Initialization', () => {
  test('Component should render correctly; contain header and h1 elements', async () => {
    await renderWithAllProviders(<Header />, { providers: { withRedux: true, withRouter: true } });

    const headerElement = await screen.findByRole('banner');
    const H1Element = screen.getByRole('heading', { level: 1 });

    expect(headerElement).toBeInTheDocument();
    expect(headerElement).toBeVisible();
    expect(H1Element).toBeInTheDocument();
    expect(H1Element).toBeVisible();
  });
});
