import user from '@Img/image-35.jpg';

import ContactLifecycle from './components/ContactLifecycle';
import ContactTableInformation from './components/ContactTableInformation';
import ContactTableNotes from './components/ContactTableNotes';

import styles from './ContactsReadPage.module.scss';

// TEMP DEV: .
const userInfo = {
  company: 'SumCompany',
  email: 'bob47@titus.org',
  phone: '08001239999',
  stage: 'Interested',
  timezone: 'GMT',
  title: 'Investor Integration Facilitator',
  username: 'Bob Woodwood',
};

// REFACTOR:  Same layout as CompaniesReadPage; consolidate into a layout
function ContactsReadPage(): React.JSX.Element {
  return (
    <div className={styles.contactsReadPage}>
      <div className={styles.contactsReadPage__header}>
        <img src={user} alt="" className={styles.userProfileImage} />
        <div className={styles.userDetails}>
          <span className={styles.userDetails__name}>{userInfo.username}</span>
          <span className={styles.userDetails__title}>{userInfo.title}</span>
        </div>
      </div>
      <div className={styles.contactsReadPage__tables}>
        <div className={styles.lifecycleTable}>
          <ContactLifecycle />
        </div>
        <div className={styles.userTable}>
          <ContactTableInformation userInfo={userInfo} />
        </div>
        <div className={styles.notesTable}>
          <ContactTableNotes />
        </div>
      </div>
    </div>
  );
}

export default ContactsReadPage;
