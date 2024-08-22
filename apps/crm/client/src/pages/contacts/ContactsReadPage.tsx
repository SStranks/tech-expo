import user from '#Img/image-35.jpg';
import styles from './_ContactsReadPage.module.scss';
import { ContactTableNotes, ContactTableInformation, ContactLifecycle } from './components';

// TEMP DEV: .
const userInfo = {
  username: 'Bob Woodwood',
  email: 'bob47@titus.org',
  company: 'SumCompany',
  title: 'Investor Integration Facilitator',
  phone: '08001239999',
  timezone: 'GMT',
  stage: 'Interested',
};

// REFACTOR:  Same layout as CompaniesReadPage; consolidate into a layout
function ContactsReadPage(): JSX.Element {
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
