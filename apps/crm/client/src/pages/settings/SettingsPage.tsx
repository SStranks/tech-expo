import { TableSettingsContacts } from '#Components/tanstack-table/tables';
import { tableDataSettingsContacts } from '#Data/MockData';
import styles from './_SettingsPage.module.scss';

function SettingsPage(): JSX.Element {
  return (
    <div className={styles.settingsPage}>
      <TableSettingsContacts tableData={tableDataSettingsContacts} />
      {/* // TODO:  Extract table into component */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Company Info</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            <tr className={styles.tbody__tr}>
              <td className={styles.td}>Address</td>
            </tr>
            <tr className={styles.tbody__tr}>
              <td className={styles.td}>Phone</td>
            </tr>
            <tr className={styles.tbody__tr}>
              <td className={styles.td}>Email</td>
            </tr>
            <tr className={styles.tbody__tr}>
              <td className={styles.td}>Website</td>
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
