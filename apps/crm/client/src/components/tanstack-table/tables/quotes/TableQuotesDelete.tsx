import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

import { TableModalView } from '#Components/tanstack-table/views';
import { ITableDataQuotes } from '#Data/MockData';

import { ColumnQuotesDelete } from '../../columns';

import styles from './_TableQuotes.module.scss';

interface IProps {
  tableData: ITableDataQuotes[];
}

function TableQuotesDelete(props: IProps): JSX.Element {
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
