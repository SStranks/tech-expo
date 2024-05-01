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
      <span>{`${role} at`}</span>
      <div className="">
        <img src={companyImg} alt="" />
        <span>{companyName}</span>
      </div>
    </div>
  );
}

export default TableContactsCardLower;
