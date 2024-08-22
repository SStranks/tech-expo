import type { ITableDataContacts } from '#Data/MockData';
import { useState } from 'react';
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ColumnCompaniesContacts } from '../../columns';
import { TableListEmbeddedView } from '#Components/tanstack-table/views';

interface IProps {
  tableData: ITableDataContacts[];
}

function TableCompaniesContacts(props: IProps): JSX.Element {
  const { tableData } = props;
  const [data] = useState<ITableDataContacts[]>(tableData);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns: ColumnCompaniesContacts,
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

export default TableCompaniesContacts;
