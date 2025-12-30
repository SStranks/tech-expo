import type { CoreRow } from '@tanstack/react-table';

import type { ITableDataContacts } from '@Data/MockData';

import ContactStatus from '@Components/tanstack-table/elements/ContactStatus';

import TableContactsOptionBtn from './TableContactsOptionBtn';

import styles from './TableContactsCardUpper.module.scss';

interface Props {
  rowOriginal: CoreRow<ITableDataContacts>['original'];
}

function TableContactsCardUpper(props: Props): React.JSX.Element {
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
