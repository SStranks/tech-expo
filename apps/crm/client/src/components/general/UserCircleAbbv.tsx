import styles from './UserCircleAbbv.module.scss';

type Props = {
  userName: string;
};

// Creates circle with the first letter of first and last name of user
function UserCircleAbbv(props: Props): React.JSX.Element {
  const { userName } = props;

  const [firstNameAbbv, lastNameAbbv] = userName.split(' ');

  return (
    <div className={styles.userCircleAbbv}>
      <span className={styles.userCircleAbbv__text}>
        {firstNameAbbv[0]}
        {lastNameAbbv[0]}
      </span>
    </div>
  );
}

export default UserCircleAbbv;
