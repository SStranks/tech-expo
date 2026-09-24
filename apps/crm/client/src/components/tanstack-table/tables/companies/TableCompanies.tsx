import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';

import type { TableDataCompanies } from '@Data/MockData';

import { useNavigate } from '@tanstack/react-router';
import { useCreateAtom, useSelector } from '@tanstack/react-store';
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  globalFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';
import { useState } from 'react';

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

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  globalFilteringFeature,
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

type Props = {
  tableData: TableDataCompanies[];
};

function TableCompanies(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [tableView, setTableView] = useState<'list' | 'grid'>('list');
  const navigate = useNavigate();

  const sortingAtom = useCreateAtom<SortingState>([]);
  const paginationAtom = useCreateAtom({ pageIndex: 0, pageSize: 10 });
  const globalFilterAtom = useCreateAtom<string>('');
  const columnFiltersAtom = useCreateAtom<ColumnFiltersState>([]);
  const pagination = useSelector(paginationAtom);

  const table = useReactTable({
    atoms: {
      columnFilters: columnFiltersAtom,
      globalFilter: globalFilterAtom,
      pagination: paginationAtom,
      sorting: sortingAtom,
    },
    columns: ColumnCompanies,
    data: tableData,
    features,
    meta: { tableName: 'companies' },
    getRowId: (originalRow) => originalRow.id,
  });

  const { getPageCount, getRowCount, options, setPageIndex, setPageSize } = table;
  const tableName = options.meta?.tableName;

  const createCompany = () => {
    void navigate({ to: '/companies/create' });
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
        columnFiltersAtom={columnFiltersAtom}
        createEntryBtn={{ displayText: 'Create Company', onClick: createCompany }}
        globalFilterAtom={globalFilterAtom}
        tableView={{ setTableView, tableView }}
        tableName={tableName}
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

export type TableCompaniesFeatures = typeof features;
export default TableCompanies;
