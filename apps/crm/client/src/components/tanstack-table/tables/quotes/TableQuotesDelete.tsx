import { getCoreRowModel } from '@tanstack/react-table';
import { useState } from 'react';

import ColumnQuotesDelete from '@Components/tanstack-table/columns/ColumnQuotesDelete';
import TableModalView from '@Components/tanstack-table/views/TableModalView';
import { ITableDataQuotes } from '@Data/MockData';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableQuotes.module.scss';

type Props = {
  tableData: ITableDataQuotes[];
};

function TableQuotesDelete(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataQuotes[]>(tableData);

  const table = useReactTable({
    columns: ColumnQuotesDelete,
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

export default TableQuotesDelete;
