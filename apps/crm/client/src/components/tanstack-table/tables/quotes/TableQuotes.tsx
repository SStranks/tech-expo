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
import { useNavigate } from 'react-router-dom';

import { TableControlsFooter, TableControlsHeader } from '@Components/tanstack-table/controls';
import { TableListView } from '@Components/tanstack-table/views';
import { ITableDataQuotes } from '@Data/MockData';

import { ColumnQuotes } from '../../columns';

import styles from './TableQuotes.module.scss';

interface IProps {
  tableData: ITableDataQuotes[];
}

function TableQuotes(props: IProps): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataQuotes[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const navigate = useNavigate();

  const table = useReactTable({
    columns: ColumnQuotes,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { tableName: 'quotes' },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getRowId: (originalRow) => originalRow.id,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },
  });

  const { getPageCount, getRowCount, options, setPageIndex, setPageSize } = table;
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
