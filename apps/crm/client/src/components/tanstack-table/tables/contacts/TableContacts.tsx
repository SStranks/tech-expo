import { useState } from 'react';
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import ListGridToggle from '#Components/buttons/list-grid-toggle/ListGridToggle';
import { IconAddCircle } from '#Components/svg';
import { ITableDataContacts } from '#Data/MockData';
import columns from '../../columns/ColumnContacts';
import GlobalFilterControl from '../../controls/global-filter/GlobalFilterControl';
import TableControls from '../../controls/pagination/TableControls';
import SortRowControl from '../../controls/sort-row/SortRowControl';
import styles from './_TableContacts.module.scss';
import FilterRowControl from '../../controls/filter-row/FilterRowControl';
import TableContactsGrid from './TableContactsGrid';

const createContactClickHandler = () => {
  console.log('Click');
};

interface IProps {
  tableData: ITableDataContacts[];
}

// TODO:  Make header of table drag/scrollable in the X direction
function TableContacts(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataContacts[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [globalFilter, setGlobalFitler] = useState<string>('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [tableView, setTableView] = useState<'list' | 'grid'>('list');

  const table = useReactTable({
    data,
    columns,
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
    onGlobalFilterChange: setGlobalFitler,
    onColumnFiltersChange: setColumnFilters,
  });

  // console.log(table.)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button type="button" className={styles.header__createContactBtn} onClick={createContactClickHandler}>
          <span>Create Contact</span>
          <IconAddCircle svgClass={styles.header__createContactBtn__svg} />
        </button>
        <div className={styles.header__controls}>
          <GlobalFilterControl
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFitler}
            debounceDelay={250}
            label="Search contacts by name, email, company, or title"
          />
          <ListGridToggle
            tableView={tableView}
            setTableView={setTableView}
            columnFilters={columnFilters}
            setColumnFilters={table.setColumnFilters}
            resetColumnFilters={table.resetColumnFilters}
          />
        </div>
      </div>
      {tableView === 'list' && (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className={styles.th}>
                      <div className={styles.th__container}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.id !== 'actions' && (
                          <div className={styles.th__container__controls}>
                            <FilterRowControl column={header.column} fieldName={header.getContext().header.id} />
                            <SortRowControl
                              sortDirection={header.column.getIsSorted()}
                              sortOnClick={header.column.getToggleSortingHandler()}
                            />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className={styles.tbody}>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={styles.tbody__tr}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.td}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr> // Empty <tr>; prevents rows from expanding to fill table when total rows height is less than the table height
              ))}
              <tr className={styles.tbody__emptyTr} />
            </tbody>
          </table>
        </div>
      )}
      {tableView === 'grid' && (
        <div className={styles.tableGridContainer}>
          <TableContactsGrid table={table} />
        </div>
      )}
      <div className={styles.tableControls}>
        <TableControls
          entriesName="contacts"
          entriesTotal={table.getRowCount()}
          pageIndex={pagination.pageIndex}
          getPageCount={table.getPageCount}
          setPageIndex={table.setPageIndex}
          setPageSize={table.setPageSize}
        />
      </div>
    </div>
  );
}

export default TableContacts;
