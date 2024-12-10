import type { ITableDataCompanies } from '@Data/MockData';

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

import { TableCompaniesCardLower, TableCompaniesCardUpper, TableGridCard } from '@Components/tanstack-table/cards';
import { TableControlsFooter, TableControlsHeader } from '@Components/tanstack-table/controls';
import { TableGridView, TableListView } from '@Components/tanstack-table/views';

import { ColumnCompanies } from '../../columns';

import styles from './TableCompanies.module.scss';

interface IProps {
  tableData: ITableDataCompanies[];
}

function TableCompanies(props: IProps): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataCompanies[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableView, setTableView] = useState<'list' | 'grid'>('list');
  const navigate = useNavigate();

  const table = useReactTable({
    getRowId: (originalRow) => originalRow.id,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },
    columns: ColumnCompanies,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { tableName: 'companies' },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const { getPageCount, getRowCount, options, resetColumnFilters, setPageIndex, setPageSize } = table;
  const tableName = options.meta?.tableName;

  const createCompany = () => {
    navigate('create');
  };

  const tableCards = table.getRowModel().rows.map((row) => {
    return (
      <TableGridCard key={row.id} id={row.original.id}>
        <TableGridCard.UpperSection>
          <TableCompaniesCardUpper rowOriginal={row.original} />
        </TableGridCard.UpperSection>
        <TableGridCard.LowerSection>
          <TableCompaniesCardLower rowOriginal={row.original} />
        </TableGridCard.LowerSection>
      </TableGridCard>
    );
  });

  return (
    <div className={styles.container}>
      <TableControlsHeader
        createEntryBtn={{ displayText: 'Create Company', onClick: createCompany }}
        globalFilter={{ globalFilter, setGlobalFilter, tableName }}
        listGridToggle={{ columnFilters, resetColumnFilters, setColumnFilters, setTableView, tableView }}
      />
      {tableView === 'list' && <TableListView table={table} />}
      {tableView === 'grid' && <TableGridView tableCards={tableCards} />}
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
