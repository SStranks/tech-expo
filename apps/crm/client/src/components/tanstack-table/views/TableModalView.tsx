import { flexRender, type Table } from '@tanstack/react-table';

import { FilterRowControl, SortRowControl } from '../controls';
import { useTableDragScroll } from '../hooks/useTableDragScroll';

import styles from './TableModalView.module.scss';

interface IProps<T> {
  table: Table<T>;
}

/*
 * NOTE: <tr />; prevents rows from expanding to fill table when total rows height is less than the table height
 */
function TableModalView<T>(props: IProps<T>): React.JSX.Element {
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
                        {header.column.getCanFilter() && (
                          <FilterRowControl column={header.column} fieldName={header.getContext().header.id} />
                        )}
                        {header.column.getCanSort() && (
                          <SortRowControl
                            sortDirection={header.column.getIsSorted()}
                            sortOnClick={header.column.getToggleSortingHandler()}
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
            <tr key={row.id} className={styles.tbody__tr}>
              {row.getVisibleCells().map((cell) => (
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

export default TableModalView;
