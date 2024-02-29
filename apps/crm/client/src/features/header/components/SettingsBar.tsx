import Notifications from '../features/notifications/Notifications';
import ThemeToggle from '../features/theme/ThemeToggle';
import UserSettings from '../features/user/UserSettingsMenu';
import styles from './_SettingsBar.module.scss';

function SettingsBar(): JSX.Element {
  return (
    <div className={styles.settingsBar}>
      <ThemeToggle />
      <Notifications />
      <UserSettings userName="Smith" />
    </div>
  );
}

export default SettingsBar;
