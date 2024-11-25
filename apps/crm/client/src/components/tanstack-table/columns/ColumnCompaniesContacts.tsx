import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataContacts } from '#Data/MockData';

import { RowActionsControl } from '../controls';
import { ContactStatus, UserSingle } from '../elements';

const columnHelper = createColumnHelper<ITableDataContacts>();

const columnCompaniesContactsDef = [
  columnHelper.accessor('name', {
    id: 'Name',
    cell: (info) => <UserSingle userName={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
  }),
  columnHelper.accessor('title', {
    id: 'Title',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
  }),
  columnHelper.accessor('status', {
    id: 'Status',
    cell: (info) => <ContactStatus status={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'Actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.EmailControl entryId={row.id} />
        <RowActionsControl.CallControl entryId={row.id} />
        <RowActionsControl.ViewControl entryId={row.id} />
      </RowActionsControl>
    ),
    header: ({ column }) => <span>{column.id}</span>,
  }),
];

export default columnCompaniesContactsDef;
