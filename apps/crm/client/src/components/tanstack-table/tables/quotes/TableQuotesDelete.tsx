import { useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
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
    data,
    columns: ColumnQuotesDelete,
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

export default TableQuotesDelete;
