import type { ITableDataCompanies } from '#Data/MockData';
import { useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { TableModalView } from '#Components/tanstack-table/views';
import { ColumnCompaniesDelete } from '../../columns';
import styles from './_TableCompanies.module.scss';

interface IProps {
  tableData: ITableDataCompanies[];
}

function TableCompanies(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataCompanies[]>(tableData);

  const table = useReactTable({
    data,
    columns: ColumnCompaniesDelete,
    getCoreRowModel: getCoreRowModel(),
    enableFilters: false,
    enableSorting: false,
  });

  return (
    <div className={styles.container}>
      <TableModalView table={table} />
    </div>
  );
}

export default TableCompanies;
