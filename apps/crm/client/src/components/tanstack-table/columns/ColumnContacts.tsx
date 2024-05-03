import { ITableDataContacts } from '#Data/MockData';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { RowActionsControl } from '../controls';

const viewControlClickFn = (row: Row<ITableDataContacts>) => {
  return () => alert(`${row.original.title}: view control`);
};

const callControlClickFn = (row: Row<ITableDataContacts>) => {
  return () => alert(`${row.original.title}: call control`);
};

const deleteControlClickFn = (row: Row<ITableDataContacts>) => {
  return () => alert(`${row.original.title}: delete control`);
};

const columnHelper = createColumnHelper<ITableDataContacts>();

const columnContactsDef = [
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor('email', { cell: (info) => info.getValue(), header: () => <span>Email</span> }),
  columnHelper.accessor('company', { cell: (info) => info.getValue(), header: () => <span>Company</span> }),
  columnHelper.accessor('title', { cell: (info) => info.getValue(), header: () => <span>Title</span> }),
  columnHelper.accessor('status', {
    cell: (info) => info.getValue(),
    header: () => <span>Status</span>,
    enableGlobalFilter: false,
    enableColumnFilter: false,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.ViewControl onClick={viewControlClickFn(row)} />
        <RowActionsControl.CallControl onClick={callControlClickFn(row)} />
        <RowActionsControl.DeleteControl onClick={deleteControlClickFn(row)} />
      </RowActionsControl>
    ),
    header: () => <span>Actions</span>,
  }),
];

export default columnContactsDef;
