import { TableSingleColumn } from '#Components/general';
import { IconCirclePlus, IconUser } from '#Components/svg';
import { TableCompaniesContacts } from '#Components/tanstack-table/tables';
import { tableDataContacts } from '#Data/MockData';
import styles from './_CompaniesTableContacts.module.scss';

function CompaniesTableContacts(): JSX.Element {
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
        <IconCirclePlus svgClass="" />
        <span>Add New Contact</span>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableContacts;
