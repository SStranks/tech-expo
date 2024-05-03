import { ITableDataQuotes } from '#Data/MockData';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { RowActionsControl } from '../controls';

const viewControlClickFn = (row: Row<ITableDataQuotes>) => {
  return () => alert(`${row.original.title}: view control`);
};

const editControlClickFn = (row: Row<ITableDataQuotes>) => {
  return () => alert(`${row.original.title}: edit control`);
};

const deleteControlClickFn = (row: Row<ITableDataQuotes>) => {
  return () => alert(`${row.original.title}: delete control`);
};

const columnHelper = createColumnHelper<ITableDataQuotes>();

const columnQuotesDef = [
  columnHelper.accessor('title', {
    cell: (info) => info.getValue(),
    header: () => <span>Title</span>,
  }),
  columnHelper.accessor('company', { cell: (info) => info.getValue(), header: () => <span>Company</span> }),
  columnHelper.accessor('total amount', {
    cell: (info) => info.getValue(),
    header: () => <span>Total Amount</span>,
    enableGlobalFilter: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor('stage', {
    cell: (info) => info.getValue(),
    header: () => <span>Stage</span>,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor((row) => ({ preparedBy: row['prepared by'], preparedFor: row['prepared for'] }), {
    id: 'participants',
    cell: (info) => (
      <span>
        {info.getValue().preparedBy} + {info.getValue().preparedFor}
      </span>
    ),
    header: () => <span>Participants</span>,
  }),
  columnHelper.accessor('created at', {
    cell: (info) => info.getValue(),
    header: () => <span>Created At</span>,
    enableGlobalFilter: false,
    enableColumnFilter: false,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.ViewControl onClick={viewControlClickFn(row)} />
        <RowActionsControl.EditControl onClick={editControlClickFn(row)} />
        <RowActionsControl.DeleteControl onClick={deleteControlClickFn(row)} />
      </RowActionsControl>
    ),
    header: () => <span>Actions</span>,
  }),
];

export default columnQuotesDef;
