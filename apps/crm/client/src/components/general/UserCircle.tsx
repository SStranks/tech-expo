import styles from './UserCircle.module.scss';

type Props = {
  userImage: string;
  alt?: string;
};

// Creates circle image with users photograph
function UserCircle(props: Props): React.JSX.Element {
  const { alt, userImage } = props;

  return <img src={userImage} alt={alt ?? userImage} className={styles.userCircle} />;
}

export default UserCircle;
