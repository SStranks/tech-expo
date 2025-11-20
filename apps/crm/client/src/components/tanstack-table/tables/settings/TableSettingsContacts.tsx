import type { ITableSettingsContacts } from '@Data/MockData';

import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useState } from 'react';

import { ColumnSettingsContacts } from '@Components/tanstack-table/columns';
import { TableControlsFooter } from '@Components/tanstack-table/controls';
import { TableDefaultView } from '@Components/tanstack-table/views';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableSettingsContacts.module.scss';

interface IProps {
  tableData: ITableSettingsContacts[];
}

function TableSettingsContacts(props: IProps): React.JSX.Element {
  const { tableData } = props;

  const [data] = useState<ITableSettingsContacts[]>(tableData);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns: ColumnSettingsContacts,
    data,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: { tableName: 'settings-contacts' },
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    state: {
      columnFilters,
      pagination,
    },
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
