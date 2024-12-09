import { render, screen } from '@testing-library/react';

import ViewportLayout from './ViewportLayout';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<ViewportLayout />);

    const viewportLayoutElement = screen.getByTestId('viewportLayout');

    expect(viewportLayoutElement).toBeInTheDocument();
    expect(viewportLayoutElement).toHaveClass(/viewportLayout/i);
  });
});
