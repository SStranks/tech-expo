import userImage from '@Img/image-35.jpg';

import styles from './UserSingle.module.scss';

// TODO:  Make image dynamic; currently not part of mock data.
const USER_IMAGE = userImage;

type Props = {
  userName: string;
};

/*
 * TODO:
 * Add another component that takes companyName initials and makes coloured circle with abbrv,
 * if userImage not available
 */
function UserSingle(props: Props): React.JSX.Element {
  const { userName } = props;

  return (
    <div className={styles.userSingle}>
      <div className={styles.userSingle__img}>
        {/* TODO: */}
        <img src={USER_IMAGE} alt={userName} />
      </div>
      <span className={styles.userSingle__userName}>{userName}</span>
    </div>
  );
}

export default UserSingle;
