import type { ITableDataDeals } from '@Data/MockData';

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';

import { TableListEmbeddedView } from '@Components/tanstack-table/views';

import { ColumnCompaniesDeals } from '../../columns';

interface IProps {
  tableData: ITableDataDeals[];
}

function TableCompaniesDeals(props: IProps): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataDeals[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    getRowId: (originalRow) => originalRow.id,
    state: {
      columnFilters,
      pagination,
      sorting,
    },
    columns: ColumnCompaniesDeals,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
  });

  const { getPageCount, setPageIndex } = table;

  return (
    <TableListEmbeddedView
      table={table}
      pageCount={getPageCount()}
      pageIndex={pagination.pageIndex}
      setPageIndex={setPageIndex}
    />
  );
}

export default TableCompaniesDeals;
