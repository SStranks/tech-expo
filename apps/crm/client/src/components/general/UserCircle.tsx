import styles from './_UserCircle.module.scss';

interface IProps {
  userImage: string;
  alt?: string;
}

// Creates circle image with users photograph
function UserCircle(props: IProps): JSX.Element {
  const { userImage, alt } = props;

  return <img src={userImage} alt={alt ?? userImage} className={styles.userCircle} />;
}

export default UserCircle;
