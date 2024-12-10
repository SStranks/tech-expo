import type { ITableDataCompanies } from '@Data/MockData';

import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useState } from 'react';

import { TableModalView } from '@Components/tanstack-table/views';

import { ColumnCompaniesDelete } from '../../columns';

import styles from './TableCompanies.module.scss';

interface IProps {
  tableData: ITableDataCompanies[];
}

function TableCompanies(props: IProps): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataCompanies[]>(tableData);

  const table = useReactTable({
    columns: ColumnCompaniesDelete,
    data,
    enableFilters: false,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={styles.container}>
      <TableModalView table={table} />
    </div>
  );
}

export default TableCompanies;
