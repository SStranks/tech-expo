import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';

import type { TableDataDeals } from '@Data/MockData';

import { useCreateAtom, useSelector } from '@tanstack/react-store';
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

import ColumnCompaniesDeals from '@Components/tanstack-table/columns/ColumnCompaniesDeals';
import TableListEmbeddedView from '@Components/tanstack-table/views/TableListEmbeddedView';
import { useReactTable } from '@Lib/tanstack';

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

type Props = {
  tableData: TableDataDeals[];
};

function TableCompaniesDeals(props: Props): React.JSX.Element {
  const { tableData } = props;

  const sortingAtom = useCreateAtom<SortingState>([]);
  const paginationAtom = useCreateAtom({ pageIndex: 0, pageSize: 5 });
  const columnFiltersAtom = useCreateAtom<ColumnFiltersState>([]);
  const pagination = useSelector(paginationAtom);

  const table = useReactTable({
    atoms: { columnFilters: columnFiltersAtom, pagination: paginationAtom, sorting: sortingAtom },
    columns: ColumnCompaniesDeals,
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

export type TableCompaniesDealsFeatures = typeof features;
export default TableCompaniesDeals;
