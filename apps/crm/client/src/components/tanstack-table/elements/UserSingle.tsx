import userImage from '#Img/image-35.jpg';
import styles from './_UserSingle.module.scss';

// TODO:  Make image dynamic; currently not part of mock data.
const USER_IMAGE = userImage;

interface IProps {
  userName: string;
}

function UserSingle(props: IProps): JSX.Element {
  const { userName } = props;

  return (
    <div className={styles.userSingle}>
      <div className={styles.userSingle__img}>
        {/* // TODO:  Add another component that takes userName initials and makes coloured circle with abbrv, if userImage not available */}
        <img src={USER_IMAGE} alt={userName} />
      </div>
      <span className={styles.userSingle__userName}>{userName}</span>
    </div>
  );
}

export default UserSingle;
