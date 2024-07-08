import styles from './_TableContactsCardLower.module.scss';

interface IProps {
  role: string;
  companyImg: string;
  companyName: string;
}

function TableContactsCardLower(props: IProps): JSX.Element {
  const { role, companyImg, companyName } = props;
  return (
    <div className={styles.contactsCardLower}>
      <span className={styles.contactsCardLower__role}>{`${role} at`}</span>
      <div className={styles.company}>
        <img src={companyImg} alt="" className={styles.company__img} />
        <span className={styles.company__name}>{companyName}</span>
      </div>
    </div>
  );
}

export default TableContactsCardLower;
