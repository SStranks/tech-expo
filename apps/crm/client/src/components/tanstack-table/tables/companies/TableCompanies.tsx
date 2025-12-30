import type { ITableDataCompanies } from '@Data/MockData';

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TableCompaniesCardLower from '@Components/tanstack-table/cards/companies/TableCompaniesCardLower';
import TableCompaniesCardUpper from '@Components/tanstack-table/cards/companies/TableCompaniesCardUpper';
import TableGridCard from '@Components/tanstack-table/cards/TableGridCard';
import ColumnCompanies from '@Components/tanstack-table/columns/ColumnCompanies';
import TableControlsFooter from '@Components/tanstack-table/controls/ui/TableControlsFooter';
import TableControlsHeader from '@Components/tanstack-table/controls/ui/TableControlsHeader';
import TableGridView from '@Components/tanstack-table/views/TableGridView';
import TableListView from '@Components/tanstack-table/views/TableListView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableCompanies.module.scss';

interface Props {
  tableData: ITableDataCompanies[];
}

function TableCompanies(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataCompanies[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableView, setTableView] = useState<'list' | 'grid'>('list');
  const navigate = useNavigate();

  const table = useReactTable({
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
    getRowId: (originalRow) => originalRow.id,
    state: {
      columnFilters,
      globalFilter,
      pagination,
      sorting,
    },
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
