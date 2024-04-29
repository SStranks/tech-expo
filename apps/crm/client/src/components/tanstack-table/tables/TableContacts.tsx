import { useState } from 'react';
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { IconFilter } from '#Components/svg';
import { ITableDataContacts } from '#Data/MockData';
import columns from '../columns/ColumnContacts';
import SortRowControl from '../controls/sort-row/SortRowControl';
import TableControls from '../controls/pagination/TableControls';
import styles from './_TableContacts.module.scss';

interface IProps {
  tableData: ITableDataContacts[];
}

// TODO:  Make header of table drag/scrollable in the X direction
function TableContacts(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataContacts[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
  });

  return (
    <div className={styles.container}>
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
                          <IconFilter svgClass={styles.th__svg} />
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
