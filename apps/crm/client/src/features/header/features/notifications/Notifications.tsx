import { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactPortal } from '#Components/index';
import { INotification } from '#Data/MockData';
import BellIcon from '#Svg/icons/Bell.svg';
import styles from './_Notifications.module.scss';
import usePortalClose from '#Hooks/usePortalClose';

interface IProps {
  notifications: INotification[];
}

// TODO:  1. Clear notifications. 2. Mark all as read. 3. Click on single notifcation; mark as read.
function Notifications(props: IProps): JSX.Element {
  const { notifications } = props;
  const [portalActive, setPortalActive] = useState<boolean>(false);
  const [notificationsList, setNotificationsList] = useState<INotification[]>(notifications);
  const portalButtonRef = useRef<HTMLButtonElement>(null);
  const portalContentRef = useRef<HTMLDivElement>(null);
  usePortalClose(portalActive, setPortalActive, portalContentRef, portalButtonRef);

  const iconClickHandler = () => {
    setPortalActive((p) => !p);
  };

  const clearAllNotificationsBtn = () => {
    setNotificationsList([]);
  };

  const notificationsListElements = notificationsList.map((el, i) => {
    return (
      <li key={`${el.identity}-${i}`} className="">
        <span>{el.logoURL}</span>
        <span>{el.identity}</span>
        <span>{el.description}</span>
        <span>{el.timeframe}</span>
      </li>
    );
  });

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
        <img src={BellIcon} alt="user icon" className={styles.notificationIcon__svg} />
        <div
          className={`${styles.indicator} ${styles[`indicator--${status}`]}`}
          data-testid="notifications-indicator"
        />
      </button>
      <ReactPortal wrapperId="portal-notifications">
        <CSSTransition
          in={portalActive}
          timeout={{ enter: 1500, exit: 1000 }}
          unmountOnExit
          classNames={{
            enter: `${styles['enter']}`,
            enterActive: `${styles['enterActive']}`,
            enterDone: `${styles['enterDone']}`,
            exit: `${styles['exit']}`,
            exitActive: `${styles['exitActive']}`,
          }}
          nodeRef={portalContentRef}>
          <div className={styles.notificationContent} data-testid="notifications" ref={portalContentRef}>
            {notifications.length > 0 ? <ul>{notificationsListElements}</ul> : 'No New Notifications'}
            <button
              type="button"
              onClick={clearAllNotificationsBtn}
              className={styles.notificationContent__clearAllBtn}>
              Clear All
            </button>
          </div>
        </CSSTransition>
      </ReactPortal>
    </>
  );
}

export default Notifications;
