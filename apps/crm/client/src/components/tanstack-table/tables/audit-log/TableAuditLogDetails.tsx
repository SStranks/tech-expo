import type { ITableAuditLogDetails } from '@Data/MockData';

import { getCoreRowModel } from '@tanstack/react-table';
import { useState } from 'react';

import ColumnAuditLogDetails from '@Components/tanstack-table/columns/ColumnAuditLogDetails';
import TableModalView from '@Components/tanstack-table/views/TableModalView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableAuditLog.module.scss';

interface Props {
  tableData: ITableAuditLogDetails[];
}

function TableAuditLogDetails(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableAuditLogDetails[]>(tableData);

  const table = useReactTable({
    columns: ColumnAuditLogDetails,
    data,
    enableFilters: false,
    enableSorting: false,
    getCoreRowModel: getCoreRowModel(),
    meta: { tableName: 'audit-details' },
  });

  return (
    <div className={styles.container}>
      <TableModalView table={table} />
    </div>
  );
}

export default TableAuditLogDetails;
