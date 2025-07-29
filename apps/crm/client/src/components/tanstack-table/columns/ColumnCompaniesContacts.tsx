import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataContacts } from '@Data/MockData';

import { RowActionsControl } from '../controls';
import { ContactStatus, UserSingle } from '../elements';

const columnHelper = createColumnHelper<ITableDataContacts>();

const columnCompaniesContactsDef = [
  columnHelper.accessor('name', {
    id: 'Name',
    enableSorting: false,
    cell: (info) => <UserSingle userName={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('title', {
    id: 'Title',
    enableSorting: false,
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('status', {
    id: 'Status',
    enableSorting: false,
    cell: (info) => <ContactStatus status={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.display({
    id: 'Actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.EmailControl entryId={row.id} />
        <RowActionsControl.CallControl phone={row.id} />
        <RowActionsControl.ViewControl entryId={row.id} />
      </RowActionsControl>
    ),
    header: ({ column }) => <span>{column.id}</span>,
  }),
];

export default columnCompaniesContactsDef;
