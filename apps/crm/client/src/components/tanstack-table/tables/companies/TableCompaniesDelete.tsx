import type { TableDataCompanies } from '@Data/MockData';

import { getCoreRowModel } from '@tanstack/react-table';
import { useState } from 'react';

import ColumnCompaniesDelete from '@Components/tanstack-table/columns/ColumnCompaniesDelete';
import TableModalView from '@Components/tanstack-table/views/TableModalView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableCompanies.module.scss';

type Props = {
  tableData: TableDataCompanies[];
};

function TableCompanies(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<TableDataCompanies[]>(tableData);

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
