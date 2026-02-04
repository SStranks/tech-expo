import type { PropsWithChildren } from 'react';

import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import ReactPortal from '@Components/modal/ReactPortal';

import styles from './ToolTip.module.scss';

/**
 * Determine the positional coordinates for the tooltip, utilizing the DOMRect coordinates of the associated element.
 * Tooltip utilizes a portal, with absolute positioning.
 * @param  {[Coords | undefined]} childCoords The DOM coordinates of the element the tooltip is to be associated with
 * @param  {[Position]} position Which side of the element the tooltip should appear on
 * @return {[number]} Pixel offset of the tooltip from the edge of the associated element
 */
const calculateFinalPosition = (childCoords: Coords | undefined, position: Position, offset: number) => {
  let top, left, translateX, translateY;
  if (childCoords === undefined || childCoords.width === undefined || childCoords.height === undefined) return;
  switch (true) {
    case position === 'top': {
      top = childCoords?.top;
      left = `calc(${childCoords?.left}px + ${childCoords?.width / 2}px)`;
      translateX = '-50%';
      translateY = `calc(-100% - ${offset}px)`;
      break;
    }
    case position === 'bottom': {
      top = `calc(${childCoords.top}px + ${childCoords?.height}px)`;
      left = `calc(${childCoords?.left}px + ${childCoords?.width / 2}px)`;
      translateX = '-50%';
      translateY = `${offset}px`;
      break;
    }
    case position === 'left': {
      top = `calc(${childCoords?.top}px + ${childCoords?.height / 2}px)`;
      left = childCoords?.left;
      translateX = `calc(-100% - ${offset}px)`;
      translateY = '-50%';
      break;
    }
    case position === 'right': {
      top = `calc(${childCoords?.top}px + ${childCoords?.height / 2}px)`;
      left = `calc(${childCoords?.left}px + ${childCoords?.width}px)`;
      translateX = `${offset}px`;
      translateY = '-50%';
      break;
    }
  }

  return {
    left,
    top,
    transform: `translate(${translateX}, ${translateY})`,
  };
};

interface Coords extends Partial<DOMRect> {}

type Position = 'left' | 'right' | 'top' | 'bottom';

type Props = {
  text: string;
  position: Position;
  offset: number;
};

function ToolTip({ children = undefined, offset, position, text }: PropsWithChildren<Props>): React.JSX.Element {
  const [childCoords, setChildCoords] = useState<Coords>();
  const [active, setActive] = useState<boolean>();
  const nodeRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const finalPosition = calculateFinalPosition(childCoords, position, offset);

  useEffect(() => {
    return () => {
      if (timeoutRef?.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  // Invokes the exit transition animation
  const onMouseLeaveHandler = () => {
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current);
    }
    setActive(false);
  };

  // Mouse must be stationary within the target element for 500ms before tooltip is triggered
  const onMouseMoveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    const { height, left, top, width } = e.currentTarget.getBoundingClientRect();
    if (timeoutRef?.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setChildCoords({ height, left, top, width });
      setActive(true);
    }, 500);
  };

  // Removes tooltip immediately upon user click; prevents visible text change and better UX
  const onClickCaptureHandler = () => {
    if (nodeRef.current) {
      nodeRef.current.style.display = 'none';
    }
  };

  return (
    <>
      <div
        onMouseMove={onMouseMoveHandler}
        onMouseLeave={onMouseLeaveHandler}
        onClickCapture={onClickCaptureHandler}
        data-testid="tooltip-component">
        {children}
      </div>
      <ReactPortal wrapperId="portal-tooltip">
        <CSSTransition
          in={active}
          timeout={{ enter: 1500, exit: 1000 }}
          unmountOnExit
          classNames={{
            enter: `${styles['enter']}`,
            enterActive: `${styles['enterActive']}`,
            enterDone: `${styles['enterDone']}`,
            exit: `${styles['exit']}`,
            exitActive: `${styles['exitActive']}`,
          }}
          nodeRef={nodeRef}>
          <div
            className={`${styles.tooltip} ${styles[`arrow-${position}`]}`}
            style={{ ...finalPosition }}
            ref={nodeRef}
            role="tooltip">
            <span className={styles.tooltip__text}>{text}</span>
          </div>
        </CSSTransition>
      </ReactPortal>
    </>
  );
}

export default ToolTip;
