import type { ITableDataDeals } from '#Data/MockData';
import { useState } from 'react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ColumnCompaniesDeals } from '../../columns';
import { TableListEmbeddedView } from '#Components/tanstack-table/views';

interface IProps {
  tableData: ITableDataDeals[];
}

function TableCompaniesDeals(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataDeals[]>(tableData);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns: ColumnCompaniesDeals,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (originalRow) => originalRow.id,
    state: {
      sorting,
      pagination,
      columnFilters,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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
