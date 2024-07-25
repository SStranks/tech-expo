import UserCircle from '#Components/general/UserCircle';
import userImage from '#Img/image-35.jpg';
import RelatedContacts from './RelatedContacts';
import styles from './_TableCompaniesCardLower.module.scss';

// TODO:  Make image dynamic; currently not part of mock data.
const USER_IMAGE = userImage;

interface IProps {
  salesOwner: string;
  relatedContacts: string[];
}

function TableCompaniesCardLower(props: IProps): JSX.Element {
  const { salesOwner, relatedContacts } = props;

  /* // TODO:  Add another component that takes userName initials and makes coloured circle with abbrv, if userImage not available */
  console.log(salesOwner);

  return (
    <div className={styles.companiesCardLower}>
      <span className={styles.companiesCardLower__relatedContacts}>Related Contacts</span>
      <span className={styles.companiesCardLower__salesOwner}>Sales Owner</span>
      <div className={styles.companiesCardLower__relatedContactsImgs}>
        <RelatedContacts relatedContacts={relatedContacts} />
      </div>
      <div className={styles.companiesCardLower__salesOwnerImg}>
        <UserCircle userImage={USER_IMAGE} />
      </div>
    </div>
  );
}

export default TableCompaniesCardLower;
