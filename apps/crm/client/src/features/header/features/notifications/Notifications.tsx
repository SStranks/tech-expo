import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactPortal } from '#Components/index';
import { IconNotificationBell } from '#Components/svg';
import { INotification, notificationsArr } from '#Data/MockData';
import usePortalClose from '#Hooks/usePortalClose';
import { CTG_ENTER_MODAL, CTG_EXIT_MODAL } from '#Utils/cssTransitionGroup';
import NotificationsList from './NotificationsList';
import styles from './_Notifications.module.scss';

// TODO:  1. Clear notifications. 2. Mark all as read. 3. Click on single notifcation; mark as read.
function Notifications(): JSX.Element {
  const [portalActive, setPortalActive] = useState<boolean>(false);
  const [notificationsList, setNotificationsList] = useState<INotification[]>(notificationsArr);
  const portalButtonRef = useRef<HTMLButtonElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
  usePortalClose(portalActive, setPortalActive, portalContentRef, portalButtonRef);

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
          unmountOnExit
          classNames={{
            enter: `${styles['enter']}`,
            enterActive: `${styles['enterActive']}`,
            enterDone: `${styles['enterDone']}`,
            exit: `${styles['exit']}`,
            exitActive: `${styles['exitActive']}`,
          }}
          nodeRef={portalContentRef}>
          <div
            style={{ left: portalButtonRef.current?.getBoundingClientRect().right }}
            className={styles.portalContent}
            data-testid="notifications"
            ref={portalContentRef}>
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
