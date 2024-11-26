import type { CoreRow } from '@tanstack/react-table';

import type { ITableDataContacts } from '@Data/MockData';

import styles from './TableContactsCardLower.module.scss';

interface IProps {
  rowOriginal: CoreRow<ITableDataContacts>['original'];
}

function TableContactsCardLower(props: IProps): JSX.Element {
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
