import type { TableAuditLogDetails as TTableAuditLogDetails } from '@Data/MockData';

import { columnFilteringFeature, rowSortingFeature, tableFeatures } from '@tanstack/react-table';

import ColumnAuditLogDetails from '@Components/tanstack-table/columns/ColumnAuditLogDetails';
import TableModalView from '@Components/tanstack-table/views/TableModalView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableAuditLog.module.scss';

const features = tableFeatures({ columnFilteringFeature, rowSortingFeature });

type Props = {
  tableData: TTableAuditLogDetails[];
};

function TableAuditLogDetails(props: Props): React.JSX.Element {
  const { tableData } = props;

  const table = useReactTable({
    columns: ColumnAuditLogDetails,
    data: tableData,
    enableFilters: false,
    enableSorting: false,
    features,
    meta: { tableName: 'audit-details' },
  });

  return (
    <div className={styles.container}>
      <TableModalView table={table} />
    </div>
  );
}

export type TableAuditLogDetailsFeatures = typeof features;
export default TableAuditLogDetails;
