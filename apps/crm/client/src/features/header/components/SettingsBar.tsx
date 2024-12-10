import { notificationsArr } from '@Data/MockData';

import Notifications from '../features/notifications/Notifications';
import ThemeToggle from '../features/theme/ThemeToggle';
import UserSettings from '../features/user/UserSettingsMenu';

import styles from './SettingsBar.module.scss';
// import TempButton from './TempButton';

function SettingsBar(): React.JSX.Element {
  return (
    <div className={styles.settingsBar}>
      {/* // TEMP DEV:  */}
      {/* <TempButton /> */}
      <ThemeToggle />
      <Notifications notifications={notificationsArr} />
      <UserSettings userName="Smith" />
    </div>
  );
}

export default SettingsBar;
