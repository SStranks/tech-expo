import { useState } from 'react';
import {
  ColumnFiltersState,
  RowData,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ITableDataCompanies } from '#Data/MockData';
import { TableControlsFooter, TableControlsHeader } from '#Components/tanstack-table/controls';
import { TableGridView, TableListView } from '#Components/tanstack-table/views';
import { ColumnCompanies } from '../../columns';
import styles from './_TableCompanies.module.scss';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    tableName: 'companies' | 'contacts' | 'quotes';
  }
}

interface IProps {
  tableData: ITableDataCompanies[];
}

function TableCompanies(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataCompanies[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFitler] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableView, setTableView] = useState<'list' | 'grid'>('list');

  const table = useReactTable({
    data,
    columns: ColumnCompanies,
    meta: { tableName: 'companies' },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFitler,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className={styles.container}>
      <TableControlsHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFitler}
        listGridToggle={{ table, tableView, setTableView, columnFilters }}
      />
      {tableView === 'list' && <TableListView table={table} />}
      {tableView === 'grid' && <TableGridView table={table} />}
      <div className={styles.tableControlsFooter}>
        <TableControlsFooter
          entriesName="contacts"
          entriesTotal={table.getRowCount()}
          pageIndex={pagination.pageIndex}
          getPageCount={table.getPageCount}
          setPageIndex={table.setPageIndex}
          setPageSize={table.setPageSize}
        />
      </div>
    </div>
  );
}

export default TableCompanies;
