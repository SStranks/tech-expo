import type { ColumnFiltersState } from '@tanstack/react-table';

import type { TableDataQuotes } from '@Data/MockData';

import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useState } from 'react';

import ColumnCompaniesQuotes from '@Components/tanstack-table/columns/ColumnCompaniesQuotes';
import TableListEmbeddedView from '@Components/tanstack-table/views/TableListEmbeddedView';
import { useReactTable } from '@Lib/tanstack';

type Props = {
  tableData: TableDataQuotes[];
};

function TableCompaniesQuotes(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<TableDataQuotes[]>(tableData);
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
