import type { ColumnFiltersState } from '@tanstack/react-table';

import type { TableDataContacts } from '@Data/MockData';

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

import ColumnCompaniesContacts from '@Components/tanstack-table/columns/ColumnCompaniesContacts';
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
  tableData: TableDataContacts[];
};

function TableCompaniesContacts(props: Props): React.JSX.Element {
  const { tableData } = props;

  const paginationAtom = useCreateAtom({ pageIndex: 0, pageSize: 5 });
  const columnFiltersAtom = useCreateAtom<ColumnFiltersState>([]);
  const pagination = useSelector(paginationAtom);

  const table = useReactTable({
    atoms: { columnFilters: columnFiltersAtom, pagination: paginationAtom },
    columns: ColumnCompaniesContacts,
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

export type TableCompaniesContactsFeatures = typeof features;
export default TableCompaniesContacts;
