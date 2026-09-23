import type { RowData, Table, TableFeatures } from '@tanstack/react-table';

import { flexRender } from '@tanstack/react-table';
import {
  column_getCanFilter,
  column_getCanSort,
  column_getIsSorted,
  column_getToggleSortingHandler,
  row_getVisibleCells,
} from '@tanstack/react-table/static-functions';

import FilterRowControl from '../controls/filter-row/FilterRowControl';
import SortRowControl from '../controls/sort-row/SortRowControl';
import { useTableDragScroll } from '../hooks/useTableDragScroll';

import styles from './TableListView.module.scss';

interface Props<TFeatures extends TableFeatures, TData extends RowData> {
  table: Table<TFeatures, TData>;
}

/*
 * NOTE: <tr />; prevents rows from expanding to fill table when total rows height is less than the table height
 */
function TableListView<TFeatures extends TableFeatures, TData extends RowData>(
  props: Props<TFeatures, TData>
): React.JSX.Element {
  const { table } = props;
  const { containerRef, handleMouseDown } = useTableDragScroll<HTMLDivElement>();

  return (
    <div className={styles.tableContainer} ref={containerRef}>
      <table className={styles.table}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <thead className={styles.thead} onMouseDown={handleMouseDown}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className={styles.th}>
                  <div className={styles.th__container}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.id !== 'Actions' && (
                      <div className={styles.th__container__controls}>
                        {column_getCanFilter(header.column) && (
                          <FilterRowControl column={header.column} fieldName={header.getContext().header.id} />
                        )}
                        {column_getCanSort(header.column) && (
                          <SortRowControl
                            sortDirection={column_getIsSorted(header.column)}
                            sortOnClick={column_getToggleSortingHandler(header.column)}
                          />
                        )}
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
            <tr key={row.id} className={styles.tbody__tr} data-table-row-id={row.id}>
              {row_getVisibleCells(row).map((cell) => (
                <td key={cell.id} className={styles.td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {/* Empty <tr>: see comment above function def */}
          <tr />
        </tbody>
      </table>
    </div>
  );
}

export default TableListView;
