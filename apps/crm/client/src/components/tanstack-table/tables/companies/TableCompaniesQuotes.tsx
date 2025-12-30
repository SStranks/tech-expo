import type { ITableDataQuotes } from '@Data/MockData';

import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useState } from 'react';

import ColumnCompaniesQuotes from '@Components/tanstack-table/columns/ColumnCompaniesQuotes';
import TableListEmbeddedView from '@Components/tanstack-table/views/TableListEmbeddedView';
import { useReactTable } from '@Lib/tanstack';

interface Props {
  tableData: ITableDataQuotes[];
}

function TableCompaniesQuotes(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataQuotes[]>(tableData);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns: ColumnCompaniesQuotes,
    data,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getRowId: (originalRow) => originalRow.id,
    state: {
      columnFilters,
      pagination,
    },
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
