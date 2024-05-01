import styles from './_TableContactsCardUpper.module.scss';

interface IProps {
  img: string;
  name: string;
  email: string;
  status: string;
}

function TableContactsCardUpper(props: IProps): JSX.Element {
  const { img, name, email, status } = props;

  return (
    <div className={styles.contactsCardUpper}>
      <img src={img} alt="" />
      <span>{name}</span>
      <span>{email}</span>
      <div className="">{status}</div>
    </div>
  );
}

export default TableContactsCardUpper;
