import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import ReactPortal from '@Components/modal/ReactPortal';
import IconNotificationBell from '@Components/svg/IconNotificationBell';
import { INotification } from '@Data/MockData';
import usePortalClose from '@Hooks/usePortalClose';
import usePortalResizeEvent from '@Hooks/usePortalResizeEvent';
import {
  CTG_ENTER_MODAL,
  CTG_EXIT_MODAL,
  CTG_ON_ENTER_CSS_ROOT,
  CTG_ON_EXITED_CSS_ROOT,
} from '@Utils/cssTransitionGroup';

import NotificationsList from './NotificationsList';

import styles from './Notifications.module.scss';

// Defined at top of 'styles' scss; used to offset portal from window edge
const CSS_ROOT_PROPERTY = '--notifications-menu-offset-x';

const GET_MENU_PORTAL_BTN_RECT = (portalButtonRef: React.RefObject<HTMLButtonElement | null>) => {
  return `${portalButtonRef.current?.getBoundingClientRect().right}px`;
};

const PORTAL_ONRESIZE = (portalButtonRef: React.RefObject<HTMLButtonElement | null>) => {
  const CSS_ROOT = document.querySelector(':root') as HTMLElement;
  const cssValue = GET_MENU_PORTAL_BTN_RECT(portalButtonRef);
  console.log(cssValue);
  CSS_ROOT?.style.setProperty(CSS_ROOT_PROPERTY, cssValue);
};

type Props = {
  notifications: INotification[];
};

// TODO:  1. Clear notifications. 2. Mark all as read. 3. Click on single notifcation; mark as read.
function Notifications(props: Props): React.JSX.Element {
  const { notifications } = props;
  const [portalActive, setPortalActive] = useState<boolean>(false);
  const [notificationsList, setNotificationsList] = useState<INotification[]>(notifications);
  const portalButtonRef = useRef<HTMLButtonElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
  usePortalClose(portalActive, setPortalActive, portalContentRef, portalButtonRef);
  usePortalResizeEvent(portalActive, () => PORTAL_ONRESIZE(portalButtonRef));

  const iconClickHandler = () => {
    setPortalActive((p) => !p);
  };

  const clearAllNotificationsBtn = () => {
    setNotificationsList([]);
  };

  let status;
  if (notificationsList.length === 0) status = 'noMessages';
  if (notificationsList.length > 0) status = 'unreadMessages';
  // if (notifications.length > 0 && 'some state variable') status = 'readMessages';

  return (
    <>
      <button
        type="button"
        className={styles.notificationIcon}
        onClick={iconClickHandler}
        ref={portalButtonRef}
        aria-label="notifications">
        <IconNotificationBell svgClass={styles.notificationIcon__svg} />
        <div
          className={`${styles.notificationIcon__indicator} ${styles[`notificationIcon__indicator--${status}`]}`}
          data-testid="notifications-indicator"
        />
      </button>
      <ReactPortal wrapperId="portal-notifications">
        <CSSTransition
          in={portalActive}
          timeout={{ enter: CTG_ENTER_MODAL, exit: CTG_EXIT_MODAL }}
          onEnter={() => CTG_ON_ENTER_CSS_ROOT(CSS_ROOT_PROPERTY, GET_MENU_PORTAL_BTN_RECT(portalButtonRef))}
          onExited={() => CTG_ON_EXITED_CSS_ROOT(CSS_ROOT_PROPERTY)}
          unmountOnExit
          classNames={{
            enter: `${styles['enter']}`,
            enterActive: `${styles['enterActive']}`,
            enterDone: `${styles['enterDone']}`,
            exit: `${styles['exit']}`,
            exitActive: `${styles['exitActive']}`,
          }}
          nodeRef={portalContentRef}>
          <div className={styles.portalContent} data-testid="notifications" ref={portalContentRef}>
            <div className={styles.notifications}>
              <div className={styles.notifications__header}>
                <h4>Notifications</h4>
              </div>
              <div className={styles.notifications__list}>
                <NotificationsList notifications={notificationsList} />
              </div>
              <div className={styles.notifications__clear}>
                <button
                  type="button"
                  onClick={clearAllNotificationsBtn}
                  className={styles.notifications__clear__clearBtn}>
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </CSSTransition>
      </ReactPortal>
    </>
  );
}

export default Notifications;
