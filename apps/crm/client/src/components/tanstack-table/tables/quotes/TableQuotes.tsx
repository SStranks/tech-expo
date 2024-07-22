import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TableControlsFooter, TableControlsHeader } from '#Components/tanstack-table/controls';
import { TableListView } from '#Components/tanstack-table/views';
import { ITableDataQuotes } from '#Data/MockData';
import { ColumnQuotes } from '../../columns';
import styles from './_TableQuotes.module.scss';

interface IProps {
  tableData: ITableDataQuotes[];
}

function TableQuotes(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataQuotes[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns: ColumnQuotes,
    meta: { tableName: 'quotes' },
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

  const { getPageCount, getRowCount, setPageIndex, setPageSize, options } = table;
  const tableName = options.meta?.tableName;

  const createQuote = () => {
    navigate('create');
  };

  return (
    <div className={styles.container}>
      <TableControlsHeader
        createEntryBtn={{ displayText: 'Create Quote', onClick: createQuote }}
        globalFilter={{ globalFilter, setGlobalFilter, tableName }}
      />
      <TableListView table={table} />
      <div className={styles.tableControlsFooter}>
        <TableControlsFooter
          entriesName="quotes"
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

export default TableQuotes;
