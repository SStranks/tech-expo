import { getCoreRowModel } from '@tanstack/react-table';
import { useState } from 'react';

import ColumnContactsDelete from '@Components/tanstack-table/columns/ColumnContactsDelete';
import TableModalView from '@Components/tanstack-table/views/TableModalView';
import { ITableDataContacts } from '@Data/MockData';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableContacts.module.scss';

interface IProps {
  tableData: ITableDataContacts[];
}

function TableContactsDelete(props: IProps): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataContacts[]>(tableData);

  const table = useReactTable({
    columns: ColumnContactsDelete,
    data,
    enableFilters: false,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.container}>
      <TableModalView table={table} />
    </div>
  );
}

export default TableContactsDelete;
