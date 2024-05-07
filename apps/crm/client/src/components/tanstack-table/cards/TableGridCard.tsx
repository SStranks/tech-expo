import type { CoreRow, Row } from '@tanstack/react-table';
import { ButtonOptions } from '#Components/buttons';
import { ITableDataContacts } from '#Data/MockData';
import { TableContactsCardLower, TableContactsCardUpper } from './';
import styles from './_TableGridCard.module.scss';

interface IProps<T> {
  row: Row<T>;
  tableName: 'companies' | 'contacts' | 'quotes' | undefined;
}

function TableGridCard<T>(props: IProps<T>): JSX.Element {
  const { row, tableName } = props;
  let upperSection, lowerSection;

  if (tableName === 'contacts') {
    const { name, email, status, title } = row.original as CoreRow<ITableDataContacts>['original'];
    upperSection = <TableContactsCardUpper img={'image'} name={name} email={email} status={status} />;
    lowerSection = <TableContactsCardLower role={title} companyImg={'image'} companyName={'test'} />;
  }

  return (
    <div className={styles.tableGridCard}>
      <div className={styles.tableGridCard__optionsBtn}>
        <ButtonOptions />
      </div>
      <div className={styles.tableGridCard__upper}>{upperSection}</div>
      <div className={styles.tableGridCard__lower}>{lowerSection}</div>
    </div>
  );
}

export default TableGridCard;
