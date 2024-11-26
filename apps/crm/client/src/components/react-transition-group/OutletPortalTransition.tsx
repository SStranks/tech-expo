import { useRef } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import ReactPortal from '@Components/modal/ReactPortal';
import { CTG_ENTER_MODAL, CTG_EXIT_MODAL } from '@Utils/cssTransitionGroup';

import styles from './reactTransitionGroup.module.scss';

// Wrapper component that adds a CSSTransition effect to React Portals.
// Example: Companies Page; clicking 'Create Company' changes route to /companies/create - this page is an outlet within the companies page.
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
