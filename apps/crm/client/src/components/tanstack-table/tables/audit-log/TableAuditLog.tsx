import type { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/react-table';

import type { TableAuditLog as TTableAuditLog } from '@Data/MockData';

import { useCreateAtom, useSelector } from '@tanstack/react-store';
import {
  columnFilteringFeature,
  createFilteredRowModel,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

import ColumnAuditLog from '@Components/tanstack-table/columns/ColumnAuditLog';
import TableControlsFooter from '@Components/tanstack-table/controls/ui/TableControlsFooter';
import TableDefaultView from '@Components/tanstack-table/views/TableDefaultView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableAuditLog.module.scss';

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createFilteredRowModel(),
  rowPaginationFeature,
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

type Props = {
  tableData: TTableAuditLog[];
};

function TableAuditLog(props: Props): React.JSX.Element {
  const { tableData } = props;

  const sortingAtom = useCreateAtom<SortingState>([]);
  const columnFiltersAtom = useCreateAtom<ColumnFiltersState>([]);
  const paginationAtom = useCreateAtom<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const pagination = useSelector(paginationAtom);

  const table = useReactTable({
    atoms: {
      columnFilters: columnFiltersAtom,
      pagination: paginationAtom,
      sorting: sortingAtom,
    },
    columns: ColumnAuditLog,
    data: tableData,
    features,
    meta: { tableName: 'audit' },
  });

  const { getPageCount, getRowCount, setPageIndex, setPageSize } = table;

  return (
    <div className={styles.container}>
      <TableDefaultView table={table} />
      <div className={styles.tableControlsFooter}>
        <TableControlsFooter
          entriesName="audit logs"
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

export type TableAuditLogFeatures = typeof features;
export default TableAuditLog;
