import type { PropsWithChildren } from 'react';

import styles from './TableSingleColumn.module.scss';

function TableSingleColumn({ children }: PropsWithChildren): React.JSX.Element {
  return <div className={styles.tableSingleColumn}>{children}</div>;
}

function TableHeader({ children }: PropsWithChildren): React.JSX.Element {
  return <div className={styles.tableSingleColumn__header}>{children}</div>;
}

function TableRow({ children }: PropsWithChildren): React.JSX.Element {
  return <div className={styles.tableSingleColumn__row}>{children}</div>;
}

TableSingleColumn.Header = TableHeader;
TableSingleColumn.Row = TableRow;

export default TableSingleColumn;
