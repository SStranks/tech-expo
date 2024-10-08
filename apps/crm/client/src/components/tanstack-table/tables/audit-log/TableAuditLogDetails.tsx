import type { ITableAuditLogDetails } from '#Data/MockData';
import { useState } from 'react';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ColumnAuditLogDetails } from '#Components/tanstack-table/columns';
import { TableModalView } from '#Components/tanstack-table/views';
import styles from './_TableAuditLog.module.scss';

interface IProps {
  tableData: ITableAuditLogDetails[];
}

function TableAuditLogDetails(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableAuditLogDetails[]>(tableData);

  const table = useReactTable({
    data,
    columns: ColumnAuditLogDetails,
    meta: { tableName: 'audit-details' },
    getCoreRowModel: getCoreRowModel(),
    enableSorting: false,
    enableFilters: false,
  });

  return (
    <div className={styles.container}>
      <TableModalView table={table} />
    </div>
  );
}

export default TableAuditLogDetails;
