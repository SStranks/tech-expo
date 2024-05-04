import { useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import ReactPortal from '#Components/modal/ReactPortal';
import { CTG_ENTER_MODAL, CTG_EXIT_MODAL } from '#Utils/cssTransitionGroup';
import styles from './_reactTransitionGroup.module.scss';

function OutletPortalTransition(): JSX.Element {
  const location = useLocation();
  const currentOutlet = useOutlet();
  const outletRef = useRef<HTMLDivElement>(null);

  return (
    <ReactPortal wrapperId="portal-outlet">
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          timeout={{ enter: CTG_ENTER_MODAL, exit: CTG_EXIT_MODAL }}
          unmountOnExit
          classNames={{
            enter: `${styles['enter']}`,
            enterActive: `${styles['enterActive']}`,
            enterDone: `${styles['enterDone']}`,
            exit: `${styles['exit']}`,
            exitActive: `${styles['exitActive']}`,
          }}
          nodeRef={outletRef}>
          {() => <div ref={outletRef}>{currentOutlet}</div>}
        </CSSTransition>
      </SwitchTransition>
    </ReactPortal>
  );
}

export default OutletPortalTransition;
