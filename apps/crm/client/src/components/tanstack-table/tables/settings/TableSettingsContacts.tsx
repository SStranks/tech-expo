import type { ITableSettingsContacts } from '#Data/MockData';
import { useState } from 'react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ColumnSettingsContacts } from '#Components/tanstack-table/columns';
import { TableControlsFooter } from '#Components/tanstack-table/controls';
import { TableDefaultView } from '#Components/tanstack-table/views';
import styles from './_TableSettingsContacts.module.scss';

interface IProps {
  tableData: ITableSettingsContacts[];
}

function TableSettingsContacts(props: IProps): JSX.Element {
  const { tableData } = props;

  const [data] = useState<ITableSettingsContacts[]>(tableData);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns: ColumnSettingsContacts,
    meta: { tableName: 'settings-contacts' },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      pagination,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    enableSorting: false,
  });

  const { getPageCount, getRowCount, setPageIndex, setPageSize } = table;

  return (
    <div className={styles.container}>
      <TableDefaultView table={table} />
      <div className={styles.tableControlsFooter}>
        <TableControlsFooter
          entriesName="users"
          entriesTotal={getRowCount()}
          pageIndex={pagination.pageIndex}
          getPageCount={getPageCount}
          setPageIndex={setPageIndex}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
}

export default TableSettingsContacts;
