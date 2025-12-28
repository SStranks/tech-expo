import ButtonAddEntry from '@Components/buttons/ButtonAddEntry';
import TableSingleColumn from '@Components/general/TableSingleColumn';
import IconUser from '@Components/svg/IconUser';
import TableCompaniesContacts from '@Components/tanstack-table/tables/companies/TableCompaniesContacts';
import { tableDataContacts } from '@Data/MockData';

import styles from './CompaniesTableContacts.module.scss';

// TEMP: .
const onClick = () => {
  console.log('Fired');
};

function CompaniesTableContacts(): React.JSX.Element {
  return (
    <TableSingleColumn>
      <TableSingleColumn.Header>
        <div className={styles.header}>
          <div className={styles.header__contacts}>
            <IconUser svgClass={styles.header__svg} />
            <span className={styles.header__title}>Contacts</span>
          </div>
          <div>
            <span className={styles.header__total}>Total contacts: {tableDataContacts.length}</span>
          </div>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <TableCompaniesContacts tableData={tableDataContacts} />
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <div className={styles.addEntryBtn}>
          <ButtonAddEntry buttonText="Add New Contact" onClick={onClick} />
        </div>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableContacts;
