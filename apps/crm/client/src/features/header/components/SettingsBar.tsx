import Notifications from '../features/notifications/Notifications';
import ThemeToggle from '../features/theme/ThemeToggle';
import UserSettings from '../features/user/UserSettingsMenu';
import styles from './_SettingsBar.module.scss';
// import TempButton from './TempButton';

function SettingsBar(): JSX.Element {
  return (
    <div className={styles.settingsBar}>
      {/* // TEMP DEV:  */}
      {/* <TempButton /> */}
      <ThemeToggle />
      <Notifications />
      <UserSettings userName="Smith" />
    </div>
  );
}

export default SettingsBar;
