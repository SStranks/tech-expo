import type { ColumnFiltersState, SortingState } from '@tanstack/react-table';

import type { TableDataContacts } from '@Data/MockData';

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

import TableContactsCardLower from '@Components/tanstack-table/cards/contacts/TableContactsCardLower';
import TableContactsCardUpper from '@Components/tanstack-table/cards/contacts/TableContactsCardUpper';
import TableGridCard from '@Components/tanstack-table/cards/TableGridCard';
import ColumnContacts from '@Components/tanstack-table/columns/ColumnContacts';
import TableControlsFooter from '@Components/tanstack-table/controls/ui/TableControlsFooter';
import TableControlsHeader from '@Components/tanstack-table/controls/ui/TableControlsHeader';
import TableGridView from '@Components/tanstack-table/views/TableGridView';
import TableListView from '@Components/tanstack-table/views/TableListView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableContacts.module.scss';

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
  tableData: TableDataContacts[];
};

function TableContacts(props: Props): React.JSX.Element {
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
    columns: ColumnContacts,
    data: tableData,
    features,
    meta: { tableName: 'contacts' },
    getRowId: (originalRow) => originalRow.id,
  });

  const { getPageCount, getRowCount, options, setPageIndex, setPageSize } = table;
  const tableName = options.meta?.tableName;

  const createContact = () => {
    void navigate({ to: '/contacts/create' });
  };

  const tableCards = table.getRowModel().rows.map((row) => {
    return (
      <TableGridCard key={row.id} id={row.original.id}>
        <TableGridCard.UpperSection>
          <TableContactsCardUpper rowOriginal={row.original} />
        </TableGridCard.UpperSection>
        <TableGridCard.LowerSection>
          <TableContactsCardLower rowOriginal={row.original} />
        </TableGridCard.LowerSection>
      </TableGridCard>
    );
  });

  return (
    <div className={styles.container}>
      <TableControlsHeader
        columnFiltersAtom={columnFiltersAtom}
        createEntryBtn={{ displayText: 'Create Contact', onClick: createContact }}
        globalFilterAtom={globalFilterAtom}
        tableView={{ setTableView, tableView }}
        tableName={tableName}
      />
      {tableView === 'list' && <TableListView table={table} />}
      {tableView === 'grid' && <TableGridView tableCards={tableCards} />}
      <div className={styles.tableControlsFooter}>
        <TableControlsFooter
          entriesName="contacts"
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

export type TableContactsFeatures = typeof features;
export default TableContacts;
