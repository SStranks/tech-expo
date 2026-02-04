import type { TableDataContacts } from '@Data/MockData';

import { getCoreRowModel } from '@tanstack/react-table';
import { useState } from 'react';

import ColumnContactsDelete from '@Components/tanstack-table/columns/ColumnContactsDelete';
import TableModalView from '@Components/tanstack-table/views/TableModalView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableContacts.module.scss';

type Props = {
  tableData: TableDataContacts[];
};

function TableContactsDelete(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<TableDataContacts[]>(tableData);

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
