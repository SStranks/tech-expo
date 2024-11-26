import type { ITableAuditLog } from '@Data/MockData';

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { ColumnAuditLog } from '@Components/tanstack-table/columns';
import { TableControlsFooter } from '@Components/tanstack-table/controls';
import { TableDefaultView } from '@Components/tanstack-table/views';

import styles from './TableAuditLog.module.scss';

interface IProps {
  tableData: ITableAuditLog[];
}

function TableAuditLog(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableAuditLog[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    columns: ColumnAuditLog,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { tableName: 'audit' },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const { getPageCount, getRowCount, setPageIndex, setPageSize } = table;

  return (
    <div className={styles.container}>
      <TableDefaultView table={table} />
      <div className={styles.tableControlsFooter}>
        <TableControlsFooter
          entriesName="audit logs"
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

export default TableAuditLog;
