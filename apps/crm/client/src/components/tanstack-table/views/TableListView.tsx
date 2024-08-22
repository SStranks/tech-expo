import { useRef } from 'react';
import { flexRender, type Table } from '@tanstack/react-table';
import { FilterRowControl, SortRowControl } from '../controls';
import styles from './_TableListView.module.scss';

interface IProps<T> {
  table: Table<T>;
}

function TableListView<T>(props: IProps<T>): JSX.Element {
  const { table } = props;
  const tableContainerRef = useRef<HTMLDivElement>(null);
  let pos = { left: 0, x: 0 };

  const theadMouseMove = (e: MouseEvent) => {
    if (tableContainerRef.current) {
      // How far the mouse has been moved
      const dx = e.clientX - pos.x;
      // Scroll the element
      tableContainerRef.current.scrollLeft = pos.left - dx;
    }
  };

  const theadMouseUp = () => {
    if (tableContainerRef.current) {
      document.body.style.cursor = 'unset';
      tableContainerRef.current.style.removeProperty('user-select');
      tableContainerRef.current.removeEventListener('mousemove', theadMouseMove);
      document.removeEventListener('mouseup', theadMouseUp);
    }
  };

  const theadMouseDown = (e: React.MouseEvent) => {
    if (tableContainerRef.current) {
      pos = {
        // The current scroll
        left: tableContainerRef.current.scrollLeft,
        // Get the current mouse position
        x: e.clientX,
      };
      document.body.style.cursor = 'grabbing';
      tableContainerRef.current.style.userSelect = 'none';
      tableContainerRef.current.addEventListener('mousemove', theadMouseMove);
      document.addEventListener('mouseup', theadMouseUp);
    }
  };

  return (
    <div className={styles.tableContainer} ref={tableContainerRef}>
      <table className={styles.table}>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <thead className={styles.thead} onMouseDown={theadMouseDown}>
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
            <tr key={row.id} className={styles.tbody__tr} data-table-row-id={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className={styles.td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {/* Empty <tr>; prevents rows from expanding to fill table when total rows height is less than the table height */}
          <tr />
        </tbody>
      </table>
    </div>
  );
}

export default TableListView;
