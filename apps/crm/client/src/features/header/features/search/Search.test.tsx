/* eslint-disable jest/no-commented-out-tests */
import { render, screen } from '@testing-library/react';
import Search from './Search';
import userEvent from '@testing-library/user-event';

describe('Initialization', () => {
  test('Component should render correctly', () => {
    render(<Search />);

    const searchBar = screen.getByRole('search');
    const formElement = screen.getByRole('form', { name: /search crm interface/ });
    const searchInput = screen.getByRole('searchbox');
    const searchFocusIcon = screen.getByText(/\//);
    // const submitButton = screen.getByLabelText(/submit search/);
    const submitButton = screen.getByRole('button', { name: /submit/ });
    const submitButtonImg = screen.getByRole('img');

    expect(searchBar).toBeInTheDocument();
    expect(searchBar).toBeVisible();
    expect(formElement).toBeInTheDocument();
    expect(formElement).toBeVisible();
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toBeVisible();
    expect(searchFocusIcon).toBeInTheDocument();
    expect(searchFocusIcon).toBeVisible();
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeVisible();
    expect(submitButton).toContainElement(submitButtonImg);
  });
});

describe('Functionality', () => {
  test('Pressing "/" key should focus the search input if no other inputs in document are focused', async () => {
    const { container } = render(
      <div>
        <Search />
        <input type="text" data-testid="dummy" />
      </div>
    );
    const user = userEvent.setup();

    const searchInput = screen.getByRole('searchbox');
    const dummyInput = screen.getByTestId('dummy');

    // Focus dummy input
    await user.click(dummyInput);
    expect(dummyInput).toHaveFocus();
    expect(searchInput).not.toHaveFocus();
    // Press "/" key
    await user.keyboard('/');
    expect(dummyInput).toHaveValue('/');
    expect(searchInput).not.toHaveFocus();
    // Unfocus dummy input
    await user.click(container);
    await user.keyboard('/');
    expect(searchInput).toHaveFocus();
    // Input is focused; "/" should add "/" char to the input stream
    await user.keyboard('/');
    expect(searchInput).toHaveValue('/');
  });

  test('Pressing "Enter" should submit search input, if input is not empty', async () => {
    render(<Search />);
    const user = userEvent.setup();
    const submitSpy = jest.spyOn(console, 'log');

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
