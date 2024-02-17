import { notificationsArr } from '#Data/MockData';
import Notifications from '../features/notifications/Notifications';
import ThemeToggle from '../features/theme/ThemeToggle';
import UserSettings from '../features/user/UserSettings';
import styles from './_SettingsBar.module.scss';

function SettingsBar(): JSX.Element {
  return (
    <div className={styles.settingsBar}>
      <ThemeToggle />
      <Notifications notifications={notificationsArr} />
      <UserSettings />
    </div>
  );
}

export default SettingsBar;
