import type { Row, TableFeatures } from '@tanstack/react-table';

import type { TableDataContacts } from '@Data/MockData';

import ContactStatus from '@Components/tanstack-table/elements/ContactStatus';

import TableContactsOptionBtn from './TableContactsOptionBtn';

import styles from './TableContactsCardUpper.module.scss';

type Props<TFeatures extends TableFeatures> = {
  rowOriginal: Row<TFeatures, TableDataContacts>['original'];
};

function TableContactsCardUpper<TFeatures extends TableFeatures>(props: Props<TFeatures>): React.JSX.Element {
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
