import { render, screen } from '@testing-library/react';
import SearchBar from './SearchBar';
import { config } from 'react-transition-group';
import userEvent from '@testing-library/user-event';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<SearchBar />);

    const searchBar = screen.getByRole('button');
    const svgIcon = screen.getByTitle('Icon Search', { exact: true });
    const kbdElement = screen.getByText('/', { exact: true });

    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toHaveTextContent('Search');
    expect(searchBar).toContainElement(svgIcon);
    expect(searchBar).toContainElement(kbdElement);
    expect(kbdElement).toBeInTheDocument();
  });
});

describe('Functionality', () => {
  test('Clicking component should render search window modal', async () => {
    render(<SearchBar />);
    // NOTE:  To disable react-transition-group; sets enter state immediately
    config.disabled = true;
    const user = userEvent.setup();

    const searchBar = screen.getByRole('button');
    await user.click(searchBar);
    // Portal content now rendered

    const portalContent = screen.getByTestId('portal-search');
    expect(portalContent).toBeInTheDocument();
  });

  test('Pressing "/" key should focus the search input if no other inputs in document are focused', async () => {
    render(
      <div>
        <SearchBar />
        <input type="text" data-testid="dummy" />
      </div>
    );
    // NOTE:  To disable react-transition-group; sets enter state immediately
    config.disabled = true;
    const user = userEvent.setup();

    const searchBar = screen.getByRole('button');
    const dummyInput = screen.getByTestId('dummy');

    // Focus dummy input
    await user.click(dummyInput);
    expect(dummyInput).toHaveFocus();
    expect(searchBar).not.toHaveFocus();
    // Press "/" key
    await user.keyboard('/');
    expect(dummyInput).toHaveValue('/');
    expect(searchBar).not.toHaveFocus();
    // Unfocus dummy input
    await dummyInput.blur();
    await user.keyboard('/');
    const portalContent = screen.getByTestId('portal-search');
    expect(portalContent).toBeInTheDocument();
  });
});
