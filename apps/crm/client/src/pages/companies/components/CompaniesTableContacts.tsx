import { TableSingleColumn } from '#Components/general';
import { IconCirclePlus, IconUser } from '#Components/svg';
import styles from './_CompaniesTableContacts.module.scss';

const totalContacts = '0';

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
            <span className={styles.header__total}>Total contacts: {totalContacts}</span>
          </div>
        </div>
      </TableSingleColumn.Header>
      <TableSingleColumn.Row>
        <div className={styles.noContacts}>
          <span>No contacts yet</span>
        </div>
      </TableSingleColumn.Row>
      <TableSingleColumn.Row>
        <IconCirclePlus svgClass="" />
        <span>Add New Contact</span>
      </TableSingleColumn.Row>
    </TableSingleColumn>
  );
}

export default CompaniesTableContacts;
