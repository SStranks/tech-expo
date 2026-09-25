import type { TableDataContacts } from '@Data/MockData';

import {
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

import ColumnContactsDelete from '@Components/tanstack-table/columns/ColumnContactsDelete';
import TableModalView from '@Components/tanstack-table/views/TableModalView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableContacts.module.scss';

const features = tableFeatures({ columnFilteringFeature, globalFilteringFeature, rowSortingFeature });

type Props = {
  tableData: TableDataContacts[];
};

function TableContactsDelete(props: Props): React.JSX.Element {
  const { tableData } = props;

  const table = useReactTable({
    columns: ColumnContactsDelete,
    data: tableData,
    enableFilters: false,
    enableSorting: false,
    features,
  });

  return (
    <div className={styles.container}>
      <TableModalView table={table} />
    </div>
  );
}

export type TableContactsDeleteFeatures = typeof features;
export default TableContactsDelete;
