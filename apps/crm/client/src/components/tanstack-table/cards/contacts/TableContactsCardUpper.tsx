import type { CoreRow } from '@tanstack/react-table';
import type { ITableDataContacts } from '#Data/MockData';
import TableContactsOptionBtn from './TableContactsOptionBtn';
import styles from './_TableContactsCardUpper.module.scss';
import { ContactStatus } from '#Components/tanstack-table/elements';

interface IProps {
  rowOriginal: CoreRow<ITableDataContacts>['original'];
}

function TableContactsCardUpper(props: IProps): JSX.Element {
  const { rowOriginal } = props;

  return (
    <div className={styles.contactsCardUpper}>
      <div className={styles.contactsCardUpper__optionsBtn}>
        <TableContactsOptionBtn rowOriginal={rowOriginal} />
      </div>
      <img src={rowOriginal.image} alt="" className={styles.contactsCardUpper__img} />
      <span className={styles.contactsCardUpper__name}>{rowOriginal.name}</span>
      <span className={styles.contactsCardUpper__email}>{rowOriginal.email}</span>
      <div className="">
        <ContactStatus status={rowOriginal.status} />
      </div>
    </div>
  );
}

export default TableContactsCardUpper;
