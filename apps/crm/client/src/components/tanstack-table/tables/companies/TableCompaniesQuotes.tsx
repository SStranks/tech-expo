import type { ITableDataQuotes } from '#Data/MockData';
import { useState } from 'react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ColumnCompaniesQuotes } from '../../columns';
import { TableListEmbeddedView } from '#Components/tanstack-table/views';

interface IProps {
  tableData: ITableDataQuotes[];
}

function TableCompaniesQuotes(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataQuotes[]>(tableData);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns: ColumnCompaniesQuotes,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (originalRow) => originalRow.id,
    state: {
      pagination,
      columnFilters,
    },
    onPaginationChange: setPagination,
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

export default TableCompaniesQuotes;
