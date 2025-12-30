import type { ITableAuditLog } from '@Data/MockData';

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

import ColumnAuditLog from '@Components/tanstack-table/columns/ColumnAuditLog';
import TableControlsFooter from '@Components/tanstack-table/controls/ui/TableControlsFooter';
import TableDefaultView from '@Components/tanstack-table/views/TableDefaultView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableAuditLog.module.scss';

type Props = {
  tableData: ITableAuditLog[];
};

function TableAuditLog(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableAuditLog[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
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
    state: {
      columnFilters,
      pagination,
      sorting,
    },
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
