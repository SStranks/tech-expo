import type { TableDataQuotes } from '@Data/MockData';

import { columnFilteringFeature, rowSortingFeature, tableFeatures } from '@tanstack/react-table';
import { useState } from 'react';

import ColumnQuotesDelete from '@Components/tanstack-table/columns/ColumnQuotesDelete';
import TableModalView from '@Components/tanstack-table/views/TableModalView';
import { useReactTable } from '@Lib/tanstack';

import styles from './TableQuotes.module.scss';

const features = tableFeatures({ columnFilteringFeature, rowSortingFeature });

type Props = {
  tableData: TableDataQuotes[];
};

function TableQuotesDelete(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<TableDataQuotes[]>(tableData);

  const table = useReactTable({
    columns: ColumnQuotesDelete,
    data,
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

export type TableQuotesDeleteFeatures = typeof features;
export default TableQuotesDelete;
