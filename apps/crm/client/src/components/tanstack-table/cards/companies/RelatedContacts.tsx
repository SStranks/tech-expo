import type { ITableDataCompanies } from '@Data/MockData';

import UserCircle from '@Components/general/UserCircle';
import userImage from '@Img/image-35.jpg';

import styles from './RelatedContacts.module.scss';

// NOTE:  This file is a DUPLICATE of one within tanstack-table/elements (and associated SCSS)
// TODO:  Make image dynamic; currently not part of mock data.
// TODO:  Make tooltip to reveal name on hover of image
// TODO:  Make tooltip to reveal names on hover over 'extra' contacts (when > 3)
// TODO:  Extract 'additional users' into its own component

const USER_IMAGE = userImage;

const CIRCLE_USER_IMAGES = (relatedContacts: ITableDataCompanies['relatedContacts']) => {
  return relatedContacts.slice(0, 3).map((contact, i) => <UserCircle key={i} alt={contact} userImage={USER_IMAGE} />);
};

const CIRCLE_EXTRA_USERS = (relatedContacts: ITableDataCompanies['relatedContacts']) => {
  if (relatedContacts.length <= 3) return null;

  const EXTRA_USERS_NUM = relatedContacts.length - 3;

  return (
    <div className={styles.extraUsers}>
      <span>+</span>
      <span>{EXTRA_USERS_NUM}</span>
    </div>
  );
};

type Props = {
  relatedContacts: ITableDataCompanies['relatedContacts'];
};

function RelatedContacts(props: Props): React.JSX.Element {
  const { relatedContacts } = props;

  const userImages = CIRCLE_USER_IMAGES(relatedContacts);
  const extraUsers = CIRCLE_EXTRA_USERS(relatedContacts);

  return (
    <div className={extraUsers ? styles.compressCircles : styles.relatedContacts}>
      {userImages}
      {extraUsers}
    </div>
  );
}

export default RelatedContacts;
