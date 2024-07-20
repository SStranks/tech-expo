import type { ITableSettingsContacts } from '#Data/MockData';
import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ITableSettingsContacts>();

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
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
];

export default columnSettingsContactsDef;
