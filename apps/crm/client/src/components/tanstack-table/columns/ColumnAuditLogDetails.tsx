import type { ITableAuditLogDetails } from '#Data/MockData';

import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<ITableAuditLogDetails>();

const columnAuditLogDetailsDef = [
  columnHelper.accessor('field', {
    id: 'Field',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('newValue', {
    id: 'New Value',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('oldValue', {
    id: 'Old Value',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
];

export default columnAuditLogDetailsDef;
