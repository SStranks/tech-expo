import { INotification } from '#Data/MockData';
import styles from './_NotificationsList.module.scss';

interface IProps {
  notifications: INotification[] | [];
}

// TODO:  Implement keyboard navigation - convert component/use 'cmdk'; pnpm add cmdk
function NotificationsList(props: IProps): JSX.Element {
  const { notifications } = props;

  const notificationsListElements = notifications.map((el, i) => {
    return (
      <li key={`${el.identity}-${i}`} className={styles.notification}>
        <img src={el.logoURL} alt="" className={styles.notification__img} />
        <div className={styles.notification__details}>
          <span className={styles.notification__identity}>{el.identity}</span>
          <span className={styles.notification__description}>{el.description}</span>
          <span className={styles.notification__timeframe}>{el.timeframe}</span>
        </div>
      </li>
    );
  });

  const noNewNotifications = (
    <div className={styles.noNewNotifications}>
      <span>No New Notifications</span>
    </div>
  );

  return (
    <div className={styles.notificationsList}>
      <ul className={styles.notificationsList__ul}>
        {notifications.length > 0 ? notificationsListElements : noNewNotifications}
      </ul>
    </div>
  );
}

export default NotificationsList;
