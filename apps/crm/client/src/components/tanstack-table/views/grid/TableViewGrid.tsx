import { PropsWithChildren } from 'react';
import styles from './_TableViewGrid.module.scss';

function TableViewGrid({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.tableViewGrid}>{children}</div>;
}

export default TableViewGrid;
