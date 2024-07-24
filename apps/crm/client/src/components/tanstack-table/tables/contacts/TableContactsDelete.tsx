import { useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ColumnContactsDelete } from '#Components/tanstack-table/columns';
import { TableModalView } from '#Components/tanstack-table/views';
import { ITableDataContacts } from '#Data/MockData';
import styles from './_TableContacts.module.scss';

interface IProps {
  tableData: ITableDataContacts[];
}

function TableContactsDelete(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataContacts[]>(tableData);

  const table = useReactTable({
    data,
    columns: ColumnContactsDelete,
    getCoreRowModel: getCoreRowModel(),
    enableFilters: false,
    enableSorting: false,
  });

  return (
    <div className={styles.container}>
      <TableModalView table={table} />
    </div>
  );
}

export default TableContactsDelete;
