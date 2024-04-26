import { useState } from 'react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { IconFilter, IconSortVertical } from '#Components/svg';
import { ITableDataContacts } from '#Data/MockData';
import columns from '../columns/ColumnContacts';
import styles from './_TableContacts.module.scss';

interface IProps {
  tableData: ITableDataContacts[];
}

function TableContacts(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataContacts[]>(tableData);

  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  return (
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
                        <IconSortVertical svgClass={styles.th__svgFilter} />
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
  );
}

export default TableContacts;
