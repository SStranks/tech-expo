import type { Row, TableFeatures } from '@tanstack/react-table';

import type { TableDataContacts } from '@Data/MockData';

import styles from './TableContactsCardLower.module.scss';

type Props<TFeatures extends TableFeatures> = {
  rowOriginal: Row<TFeatures, TableDataContacts>['original'];
};

function TableContactsCardLower<TFeatures extends TableFeatures>(props: Props<TFeatures>): React.JSX.Element {
  const { rowOriginal } = props;

  return (
    <div className={styles.contactsCardLower}>
      <span className={styles.contactsCardLower__role}>{`${rowOriginal.title} at`}</span>
      <div className={styles.company}>
        <img src={rowOriginal.companyLogo} alt="" className={styles.company__img} />
        <span className={styles.company__name}>{rowOriginal.company}</span>
      </div>
    </div>
  );
}

export default TableContactsCardLower;
