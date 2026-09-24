import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';

import type { TableDataQuotes } from '@Data/MockData';

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

import ColumnQuotes from '@Components/tanstack-table/columns/ColumnQuotes';
import TableControlsFooter from '@Components/tanstack-table/controls/ui/TableControlsFooter';
import TableControlsHeader from '@Components/tanstack-table/controls/ui/TableControlsHeader';
import TableListView from '@Components/tanstack-table/views/TableListView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableQuotes.module.scss';

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
  tableData: TableDataQuotes[];
};

function TableQuotes(props: Props): React.JSX.Element {
  const { tableData } = props;
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
    columns: ColumnQuotes,
    data: tableData,
    features,
    meta: { tableName: 'quotes' },
    getRowId: (originalRow) => originalRow.id,
  });

  const { getPageCount, getRowCount, options, setPageIndex, setPageSize } = table;
  const tableName = options.meta?.tableName;

  const createQuote = () => {
    void navigate({ to: '/quotes/create' });
  };

  return (
    <div className={styles.container}>
      <TableControlsHeader
        columnFiltersAtom={columnFiltersAtom}
        createEntryBtn={{ displayText: 'Create Quote', onClick: createQuote }}
        globalFilterAtom={globalFilterAtom}
        tableName={tableName}
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

export type TableQuotesFeatures = typeof features;
export default TableQuotes;
