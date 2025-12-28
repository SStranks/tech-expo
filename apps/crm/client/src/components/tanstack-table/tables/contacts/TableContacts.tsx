import type { ITableDataContacts } from '@Data/MockData';

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

interface IProps {
  tableData: ITableDataContacts[];
}

function TableContacts(props: IProps): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataContacts[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableView, setTableView] = useState<'list' | 'grid'>('list');
  const navigate = useNavigate();

  const table = useReactTable({
    columns: ColumnContacts,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: { tableName: 'contacts' },
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

  const createContact = () => {
    navigate('create');
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
        createEntryBtn={{ displayText: 'Create Contact', onClick: createContact }}
        globalFilter={{ globalFilter, setGlobalFilter, tableName }}
        listGridToggle={{ columnFilters, resetColumnFilters, setColumnFilters, setTableView, tableView }}
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

export default TableContacts;
