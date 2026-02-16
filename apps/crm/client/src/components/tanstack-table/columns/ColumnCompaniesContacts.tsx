import type { TableDataContacts } from '@Data/MockData';

import { createColumnHelper } from '@tanstack/react-table';

import RowActionsControl from '../controls/actions-row/RowActionsControl';
import ContactStatus from '../elements/ContactStatus';
import UserSingle from '../elements/UserSingle';

const columnHelper = createColumnHelper<TableDataContacts>();

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
    header: ({ column }) => <span>{column.id}</span>,
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.EmailControl entryId={row.id} />
        <RowActionsControl.CallControl phone={row.id} />
        <RowActionsControl.ViewControl entryId={row.id} />
      </RowActionsControl>
    ),
  }),
];

export default columnCompaniesContactsDef;
