import type { ColumnFiltersState, PaginationState } from '@tanstack/react-table';

import type { TableDataQuotes } from '@Data/MockData';

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

import ColumnCompaniesQuotes from '@Components/tanstack-table/columns/ColumnCompaniesQuotes';
import TableListEmbeddedView from '@Components/tanstack-table/views/TableListEmbeddedView';
import { useReactTable } from '@Lib/tanstack';

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

function TableCompaniesQuotes(props: Props): React.JSX.Element {
  const { tableData } = props;

  const paginationAtom = useCreateAtom<PaginationState>({ pageIndex: 0, pageSize: 5 });
  const columnFiltersAtom = useCreateAtom<ColumnFiltersState>([]);
  const pagination = useSelector(paginationAtom);

  const table = useReactTable({
    atoms: {
      columnFilters: columnFiltersAtom,
      pagination: paginationAtom,
    },
    columns: ColumnCompaniesQuotes,
    data: tableData,
    features,
    getRowId: (originalRow) => originalRow.id,
  });

  const { getPageCount, setPageIndex } = table;

  return (
    <TableListEmbeddedView
      table={table}
      pageCount={getPageCount()}
      pageIndex={pagination.pageIndex}
      setPageIndex={setPageIndex}
    />
  );
}

export type TableCompaniesQuotesFeatures = typeof features;
export default TableCompaniesQuotes;
