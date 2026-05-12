import { Outlet, useLocation } from '@tanstack/react-router';
import { useRef } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';

import { CTG_ENTER_MODAL, CTG_EXIT_MODAL } from '@Utils/cssTransitionGroup';

import styles from './reactTransitionGroup.module.scss';

function OutletTransition(): React.JSX.Element {
  const location = useLocation();
  const outletRef = useRef<HTMLDivElement>(null);

  return (
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
        {() => (
          <div ref={outletRef}>
            <Outlet />
          </div>
        )}
      </CSSTransition>
    </SwitchTransition>
  );
}

export default OutletTransition;
