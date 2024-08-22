import { IconCity, IconEmail, IconGlobal, IconPhone } from '#Components/svg';
import { TableSettingsContacts } from '#Components/tanstack-table/tables';
import { tableDataSettingsContacts, tableDataSettingsCompanyInfo } from '#Data/MockData';
import styles from './_SettingsPage.module.scss';

// TEMP DEV: // NOTE:  Make dynamic
const COMPANY_INFO = tableDataSettingsCompanyInfo;

function SettingsPage(): JSX.Element {
  return (
    <div className={styles.settingsPage}>
      <TableSettingsContacts tableData={tableDataSettingsContacts} />
      {/* // TODO:  Convert to NON <table>; not correct use case */}
      {/* // TODO:  Extract table into component */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>
                <span>Company Info</span>
              </th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            <tr className={styles.tbody__tr}>
              <td className={styles.td}>
                <div className={styles.companyInfo}>
                  <IconCity svgClass={styles.companyInfo__icon} />
                  <span>Address</span>
                  <p>{COMPANY_INFO[0].address}</p>
                </div>
              </td>
            </tr>
            <tr className={styles.tbody__tr}>
              <td className={styles.td}>
                <div className={styles.companyInfo}>
                  <IconPhone svgClass={styles.companyInfo__icon} />
                  <span>Phone</span>
                  <p>{COMPANY_INFO[0].phone}</p>
                </div>
              </td>
            </tr>
            <tr className={styles.tbody__tr}>
              <td className={styles.td}>
                <div className={styles.companyInfo}>
                  <IconEmail svgClass={styles.companyInfo__icon} />
                  <span>Email</span>
                  <p>{COMPANY_INFO[0].email}</p>
                </div>
              </td>
            </tr>
            <tr className={styles.tbody__tr}>
              <td className={styles.td}>
                <div className={styles.companyInfo}>
                  <IconGlobal svgClass={styles.companyInfo__icon} />
                  <span>Website</span>
                  <p>{COMPANY_INFO[0].website}</p>
                </div>
              </td>
            </tr>
            {/* Empty <tr>; prevents rows from expanding to fill table when total rows height is less than the table height */}
            <tr />
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SettingsPage;
