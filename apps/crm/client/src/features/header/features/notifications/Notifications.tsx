import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ReactPortal } from '#Components/index';
import { INotification } from '#Data/MockData';
import BellIcon from '#Svg/icons/Bell.svg';
import styles from './_Notifications.module.scss';

interface IProps {
  notifications: INotification[];
}

function Notifications(props: IProps): JSX.Element {
  const { notifications } = props;
  const [portalActive, setPortalActive] = useState<boolean>(false);
  const portalContentRef = useRef<HTMLDivElement>(null);

  // Close notifications window on Escape keydown or click outside modal content
  useEffect(() => {
    const closePortal = (e: KeyboardEvent | MouseEvent) => {
      if (portalActive && e instanceof KeyboardEvent && (e.key === 'Esc' || e.key === 'Escape')) {
        setPortalActive(false);
      }
      if (!portalContentRef.current) return;
      console.log(e.target);
      if (portalActive && e instanceof MouseEvent && !portalContentRef.current.contains(e.target as HTMLElement))
        setPortalActive(false);
    };

    document.addEventListener('keydown', closePortal);
    document.addEventListener('click', closePortal);
    return () => {
      document.removeEventListener('keydown', closePortal);
      document.removeEventListener('click', closePortal);
    };
  });

  const iconClickHandler = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPortalActive((p) => !p);
  };

  const notificationsList = notifications.map((el, i) => {
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
  if (notifications.length === 0) status = 'noMessages';
  if (notifications.length > 0) status = 'unreadMessages';
  // if (notifications.length > 0 && 'some state variable') status = 'readMessages';

  return (
    <>
      <button type="button" className={styles.notificationIcon} onClick={iconClickHandler} aria-label="notifications">
        <img src={BellIcon} alt="user icon" />
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
            {notifications.length > 0 ? <ul>{notificationsList}</ul> : 'No New Notifications'}
          </div>
        </CSSTransition>
      </ReactPortal>
    </>
  );
}

export default Notifications;
