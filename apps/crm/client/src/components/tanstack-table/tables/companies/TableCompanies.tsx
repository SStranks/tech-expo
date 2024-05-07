import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { TableControlsFooter, TableControlsHeader } from '#Components/tanstack-table/controls';
import { TableGridView, TableListView } from '#Components/tanstack-table/views';
import { ITableDataCompanies } from '#Data/MockData';
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
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableView, setTableView] = useState<'list' | 'grid'>('list');
  const navigate = useNavigate();

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
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  const { getPageCount, getRowCount, setPageIndex, setPageSize, resetColumnFilters, options } = table;
  const tableName = options.meta?.tableName;

  const createCompany = () => {
    navigate('create');
  };

  return (
    <div className={styles.container}>
      <TableControlsHeader
        createEntryBtn={{ displayText: 'Create Company', onClick: createCompany }}
        globalFilter={{ globalFilter, setGlobalFilter, tableName }}
        listGridToggle={{ tableView, setTableView, columnFilters, setColumnFilters, resetColumnFilters }}
      />
      {tableView === 'list' && <TableListView table={table} />}
      {tableView === 'grid' && <TableGridView table={table} />}
      <div className={styles.tableControlsFooter}>
        <TableControlsFooter
          entriesName="companies"
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

export default TableCompanies;
