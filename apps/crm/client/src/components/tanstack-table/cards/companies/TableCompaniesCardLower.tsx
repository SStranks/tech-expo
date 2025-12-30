import type { CoreRow } from '@tanstack/react-table';

import type { ITableDataCompanies } from '@Data/MockData';

import UserCircle from '@Components/general/UserCircle';
import userImage from '@Img/image-35.jpg';

import RelatedContacts from './RelatedContacts';

import styles from './TableCompaniesCardLower.module.scss';

// TODO:  Make image dynamic; currently not part of mock data.
const USER_IMAGE = userImage;

type Props = {
  rowOriginal: CoreRow<ITableDataCompanies>['original'];
};

function TableCompaniesCardLower(props: Props): React.JSX.Element {
  const { rowOriginal } = props;

  /*
   * TODO: Add another component that takes userName initials and makes coloured circle with abbrv,
   * if userImage not available
   */
  return (
    <div className={styles.companiesCardLower}>
      <span className={styles.companiesCardLower__relatedContacts}>Related Contacts</span>
      <span className={styles.companiesCardLower__salesOwner}>Sales Owner</span>
      <div className={styles.companiesCardLower__relatedContactsImgs}>
        <RelatedContacts relatedContacts={rowOriginal.relatedContacts} />
      </div>
      <div className={styles.companiesCardLower__salesOwnerImg}>
        <UserCircle userImage={USER_IMAGE} />
      </div>
    </div>
  );
}

export default TableCompaniesCardLower;
