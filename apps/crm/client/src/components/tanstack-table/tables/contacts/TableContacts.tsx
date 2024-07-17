import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ColumnFiltersState,
  RowData,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { TableControlsFooter, TableControlsHeader } from '#Components/tanstack-table/controls';
import { TableGridView, TableListView } from '#Components/tanstack-table/views';
import { ITableDataContacts } from '#Data/MockData';
import { ColumnContacts } from '../../columns';
import styles from './_TableContacts.module.scss';
import { TableContactsCardLower, TableContactsCardUpper, TableGridCard } from '#Components/tanstack-table/cards';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    tableName: 'companies' | 'contacts' | 'quotes' | 'audit';
  }
}

interface IProps {
  tableData: ITableDataContacts[];
}

function TableContacts(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataContacts[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableView, setTableView] = useState<'list' | 'grid'>('list');
  const navigate = useNavigate();

  const table = useReactTable({
    data,
    columns: ColumnContacts,
    meta: { tableName: 'contacts' },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      pagination,
      globalFilter,
      columnFilters,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  const { getPageCount, getRowCount, setPageIndex, setPageSize, resetColumnFilters, options } = table;
  const tableName = options.meta?.tableName;

  const createContact = () => {
    navigate('create');
  };

  const tableCards = table.getRowModel().rows.map((row) => {
    const { name, email, image, status, title, company, companyLogo } = row.original;
    return (
      <TableGridCard key={row.id}>
        <TableGridCard.UpperSection>
          <TableContactsCardUpper img={image} name={name} email={email} status={status} />
        </TableGridCard.UpperSection>
        <TableGridCard.LowerSection>
          <TableContactsCardLower role={title} companyImg={companyLogo} companyName={company} />
        </TableGridCard.LowerSection>
      </TableGridCard>
    );
  });

  return (
    <div className={styles.container}>
      <TableControlsHeader
        createEntryBtn={{ displayText: 'Create Contact', onClick: createContact }}
        globalFilter={{ globalFilter, setGlobalFilter, tableName }}
        listGridToggle={{ tableView, setTableView, columnFilters, setColumnFilters, resetColumnFilters }}
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
