import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataContacts } from '@Data/MockData';

import { RowActionsControl } from '../controls';
import { ContactStatus, UserSingle } from '../elements';

const columnHelper = createColumnHelper<ITableDataContacts>();

const columnContactsDef = [
  columnHelper.accessor('name', {
    cell: (info) => <UserSingle userName={info.getValue()} />,
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor('email', { cell: (info) => info.getValue(), header: () => <span>Email</span> }),
  columnHelper.accessor('company', { cell: (info) => info.getValue(), header: () => <span>Company</span> }),
  columnHelper.accessor('title', { cell: (info) => info.getValue(), header: () => <span>Title</span> }),
  columnHelper.accessor('status', {
    enableColumnFilter: false,
    enableGlobalFilter: false,
    cell: (info) => <ContactStatus status={info.getValue()} />,
    header: () => <span>Status</span>,
  }),
  columnHelper.display({
    id: 'Actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.ViewControl entryId={row.id} />
        <RowActionsControl.CallControl phone={row.original.phone} />
        <RowActionsControl.DeleteControl rowOriginal={row.original} />
      </RowActionsControl>
    ),
    header: () => <span>Actions</span>,
  }),
];

export default columnContactsDef;
