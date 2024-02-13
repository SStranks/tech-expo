import { render, screen } from '@testing-library/react';
import MenuToggle from './MenuToggle';
import userEvent from '@testing-library/user-event';

const reactSetState = jest.fn();

beforeEach(() => {
  reactSetState.mockReset();
});

describe('Initialization', () => {
  test('Component renders correctly', () => {
    render(<MenuToggle sidebarMaximize={undefined} setSidebarMaximize={reactSetState} />);

    const menuToggleButton = screen.getByRole('button');
    const svgElement = screen.getByTitle('sidebar menu toggle');

    expect(menuToggleButton).toBeInTheDocument();
    expect(menuToggleButton).toBeVisible();
    expect(menuToggleButton).toContainElement(svgElement);
  });

  test('Prop "sidebarMaximize" is True; class applied', () => {
    render(<MenuToggle sidebarMaximize={true} setSidebarMaximize={reactSetState} />);

    const svgPathElement_1 = screen.getByTestId('path-1');
    const svgPathElement_2 = screen.getByTestId('path-2');

    expect(svgPathElement_1).toHaveClass(/--reverse/);
    expect(svgPathElement_2).toHaveClass(/--reverse/);
  });

  test('Prop "sidebarMaximize" is False/Undefined; class not applied', () => {
    render(<MenuToggle sidebarMaximize={false} setSidebarMaximize={reactSetState} />);

    const svgPathElement_1 = screen.getByTestId('path-1');
    const svgPathElement_2 = screen.getByTestId('path-2');

    expect(svgPathElement_1).not.toHaveClass(/--reverse/);
    expect(svgPathElement_2).not.toHaveClass(/--reverse/);
  });
});

describe('Functionality', () => {
  test('Clicking button should call setState callback', async () => {
    render(<MenuToggle sidebarMaximize={undefined} setSidebarMaximize={reactSetState} />);
    const user = userEvent.setup();

    const menuToggleButton = screen.getByRole('button');

    await user.click(menuToggleButton);

    expect(reactSetState).toHaveBeenCalled();
  });
});
