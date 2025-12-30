import type { TableAuditLogDetails } from '@Data/MockData';

import { createColumnHelper } from '@tanstack/react-table';

const columnHelper = createColumnHelper<TableAuditLogDetails>();

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
