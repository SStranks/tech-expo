import CompanyLogo from '#Img/Microsoft_logo.png';
import {
  CompaniesTableContacts,
  CompaniesTableDeals,
  CompaniesTableInformation,
  CompaniesTableNotes,
  CompaniesTableQuotes,
} from './components';
import styles from './_CompaniesReadPage.module.scss';

const companyName = 'Microsoft';
const salesOwner = 'Bob Woodwood';

const companyInfo = {
  size: 'ENTERPRISE',
  revenue: '$27,000,000,000',
  industry: 'TELECOMMUNICATIONS',
  type: 'B2G',
  country: 'England',
  website: 'http://boom.com',
};

function CompaniesReadPage(): JSX.Element {
  return (
    <div className={styles.companiesReadPage}>
      <div className={styles.companiesReadPage__header}>
        <img src={CompanyLogo} alt="" className={styles.companyLogo} />
        <div className={styles.companyDetails}>
          <span className={styles.companyDetails__name}>{companyName}</span>
          <span className={styles.companyDetails__salesOwner}>Sales Owner: {salesOwner}</span>
        </div>
      </div>
      <div className={styles.companiesReadPage__tables}>
        <div className={styles.companyTable}>
          <CompaniesTableInformation companyInfo={companyInfo} />
        </div>
        <div className={styles.contactsTable}>
          <CompaniesTableContacts />
        </div>
        <div className={styles.dealsTable}>
          <CompaniesTableDeals />
        </div>
        <div className={styles.quotesTable}>
          <CompaniesTableQuotes />
        </div>
        <div className={styles.notesTable}>
          <CompaniesTableNotes />
        </div>
      </div>
    </div>
  );
}

export default CompaniesReadPage;
