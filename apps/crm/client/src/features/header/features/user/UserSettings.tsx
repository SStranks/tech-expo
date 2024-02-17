import UserIcon from '#Svg/icons/User Circle.svg';
import styles from './_UserSettings.module.scss';

function UserSettings(): JSX.Element {
  return (
    <button type="button" className={styles.userIcon} aria-label="user settings">
      <img src={UserIcon} alt="user icon" />
    </button>
  );
}
export default UserSettings;
