import type { TableSettingsContacts } from '@Data/MockData';

import { createColumnHelper } from '@tanstack/react-table';

import SettingsRole from '../elements/SettingsRole';

const columnHelper = createColumnHelper<TableSettingsContacts>();

const columnSettingsContactsDef = [
  columnHelper.accessor('name', {
    id: 'Name',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('title', {
    id: 'Title',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('role', {
    id: 'Role',
    cell: (info) => <SettingsRole userRole={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
];

export default columnSettingsContactsDef;
