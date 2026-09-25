import type { ColumnFiltersState } from '@tanstack/react-table';

import type { TableSettingsContacts as TTableSettingsContacts } from '@Data/MockData';

import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

import ColumnSettingsContacts from '@Components/tanstack-table/columns/ColumnSettingsContacts';
import TableControlsFooter from '@Components/tanstack-table/controls/ui/TableControlsFooter';
import TableDefaultView from '@Components/tanstack-table/views/TableDefaultView';
import { useReactTable } from '@Lib/tanstack';

const features = tableFeatures({
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  rowPaginationFeature,
  rowSortingFeature,
});

import { useCreateAtom, useSelector } from '@tanstack/react-store';

import styles from './TableSettingsContacts.module.scss';

type Props = {
  tableData: TTableSettingsContacts[];
};

function TableSettingsContacts(props: Props): React.JSX.Element {
  const { tableData } = props;

  const paginationAtom = useCreateAtom({ pageIndex: 0, pageSize: 10 });
  const columnFiltersAtom = useCreateAtom<ColumnFiltersState>([]);
  const pagination = useSelector(paginationAtom);

  const table = useReactTable({
    atoms: { columnFilters: columnFiltersAtom, pagination: paginationAtom },
    columns: ColumnSettingsContacts,
    data: tableData,
    enableSorting: false,
    features,
    meta: { tableName: 'settings-contacts' },
  });

  const { getPageCount, getRowCount, setPageIndex, setPageSize } = table;

  return (
    <div className={styles.container}>
      <TableDefaultView table={table} />
      <div className={styles.tableControlsFooter}>
        <TableControlsFooter
          entriesName="users"
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

export type TableSettingsContactsFeatures = typeof features;
export default TableSettingsContacts;
