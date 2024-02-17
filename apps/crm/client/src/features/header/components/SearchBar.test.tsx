import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<SearchBar />);

    const searchBar = screen.getByRole('search');

    expect(searchBar).toBeInTheDocument();
  });
});
