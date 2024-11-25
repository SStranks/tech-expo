import type { PropsWithChildren } from 'react';

import styles from './_TableSingleColumn.module.scss';

function TableSingleColumn({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.tableSingleColumn}>{children}</div>;
}

function TableHeader({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.tableSingleColumn__header}>{children}</div>;
}

function TableRow({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.tableSingleColumn__row}>{children}</div>;
}

TableSingleColumn.Header = TableHeader;
TableSingleColumn.Row = TableRow;

export default TableSingleColumn;
