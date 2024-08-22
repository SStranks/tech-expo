import { render, screen } from '@testing-library/react';
import ReactPortal from './ReactPortal';

describe('Initialization', () => {
  test('Portal should render correctly; when no wrapper with matching Id is provided it should auto-generate its own wrapper instead', () => {
    // NOTE:  Portal will render outside of RTL <div> container. This will be first div - should be empty.
    const { container } = render(
      <ReactPortal wrapperId="modal">
        <div>Dummy Component</div>
      </ReactPortal>
    );

    const componentPortal = screen.getByTestId('react-portal-wrapper');

    expect(container).toBeEmptyDOMElement();
    expect(componentPortal).toBeInTheDocument();
    expect(componentPortal).toHaveAttribute('id', 'modal');
    expect(componentPortal).toHaveTextContent('Dummy Component');
  });

  test('Portal should render correctly; when wrapper with matching Id is provided it should render insider the provided wrapper', () => {
    // NOTE:  Portal will render outside of RTL <div> container. This will be first div - should be empty.
    const { container } = render(
      <>
        <div id="modal" data-testid="react-portal-wrapper" />
        <ReactPortal wrapperId="modal">
          <div>Dummy Component</div>
        </ReactPortal>
      </>
    );

    const portalWrapper = screen.getByTestId('react-portal-wrapper');
    const portalContent = screen.getByText(/dummy component/i);

    expect(container).not.toBeEmptyDOMElement();
    expect(portalWrapper).toBeInTheDocument();
    expect(portalWrapper).toHaveAttribute('id', 'modal');
    expect(portalWrapper).toContainElement(portalContent);
  });
});
