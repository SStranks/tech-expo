import type { Table } from '@tanstack/react-table';
import { TableGridCard } from '../cards';
import styles from './_TableGridView.module.scss';

interface IProps<T> {
  table: Table<T>;
}

function TableGridView<T>(props: IProps<T>): JSX.Element {
  const { table } = props;

  const tableCards = table.getRowModel().rows.map((row) => {
    return <TableGridCard key={row.id} row={row} tableName={table.options.meta?.tableName} />;
  });

  return <div className={styles.tableGridView}>{tableCards}</div>;
}

export default TableGridView;
