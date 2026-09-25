import type { TableDataCompanies } from '@Data/MockData';

import {
  columnFilteringFeature,
  globalFilteringFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table';

import ColumnCompaniesDelete from '@Components/tanstack-table/columns/ColumnCompaniesDelete';
import TableModalView from '@Components/tanstack-table/views/TableModalView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableCompanies.module.scss';

const features = tableFeatures({ columnFilteringFeature, globalFilteringFeature, rowSortingFeature });

type Props = {
  tableData: TableDataCompanies[];
};

function TableCompanies(props: Props): React.JSX.Element {
  const { tableData } = props;

  const table = useReactTable({
    columns: ColumnCompaniesDelete,
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

export type TableCompaiesDeleteFeatures = typeof features;
export default TableCompanies;
