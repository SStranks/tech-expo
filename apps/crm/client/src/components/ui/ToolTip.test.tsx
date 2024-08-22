import { render, screen } from '@testing-library/react';
import { config } from 'react-transition-group';
import ToolTip from './Tooltip';
import userEvent from '@testing-library/user-event';

describe('Initialization', () => {
  test('Component should render correctly; actual tooltip should not be present before hover event', () => {
    // NOTE:  Portal will render outside of RTL <div> container. This will be first div - should be empty.
    const { container } = render(
      <ToolTip text="Tooltip Text" position="top" offset={0}>
        <span>Dummy</span>
      </ToolTip>
    );

    const tooltipComponent = screen.getByTestId('tooltip-component');
    const tooltipElement = screen.queryByText('Tooltip Text');
    const tooltipTarget = screen.getByText('Dummy');

    expect(container).toContainElement(tooltipComponent);
    // Tooltip should not be rendered before hover event
    expect(tooltipElement).not.toBeInTheDocument();
    // The target element should be visible in DOM
    expect(tooltipTarget).toBeInTheDocument();
    expect(tooltipTarget).toBeVisible();
  });
});

describe('Functionality', () => {
  test('Tooltip should insert into portal "portal-tooltip" upon hover of target/dummy element', async () => {
    // NOTE:  Portal will render outside of RTL <div> container. This will be first div - should be empty.
    render(
      <ToolTip text="Tooltip Text" position="top" offset={0}>
        <span>Dummy</span>
      </ToolTip>
    );
    const user = userEvent.setup();
    // NOTE:  To disable react-transition-group; sets enter state immediately
    config.disabled = true;

    const tooltipComponent = screen.getByTestId('tooltip-component');

    await user.hover(tooltipComponent);
    const tooltipElement = await screen.findByText('Tooltip Text');

    // Tooltip renders through portal
    expect(tooltipElement).toBeInTheDocument();
    expect(tooltipElement).toBeVisible();
    // Tooltip text should now be visible
    expect(tooltipElement).toBeInTheDocument();
    expect(tooltipElement).toBeVisible();

    // Unhover target element; tooltip should be removed
    await user.unhover(tooltipComponent);

    expect(tooltipElement).not.toBeInTheDocument();
    expect(tooltipElement).not.toBeVisible();
    // Tooltip text should now be visible
    expect(tooltipElement).not.toBeInTheDocument();
    expect(tooltipElement).not.toBeVisible();
  });
});
