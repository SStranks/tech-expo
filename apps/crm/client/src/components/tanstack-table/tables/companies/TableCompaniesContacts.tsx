import type { TableDataContacts } from '@Data/MockData';

import { ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table';
import { useState } from 'react';

import ColumnCompaniesContacts from '@Components/tanstack-table/columns/ColumnCompaniesContacts';
import TableListEmbeddedView from '@Components/tanstack-table/views/TableListEmbeddedView';
import { useReactTable } from '@Lib/tanstack';

type Props = {
  tableData: TableDataContacts[];
};

function TableCompaniesContacts(props: Props): React.JSX.Element {
  const { tableData } = props;
  const [data] = useState<TableDataContacts[]>(tableData);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    columns: ColumnCompaniesContacts,
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

export default TableCompaniesContacts;
