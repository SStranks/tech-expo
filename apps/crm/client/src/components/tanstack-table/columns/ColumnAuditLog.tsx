import type { ITableAuditLog } from '@Data/MockData';

import { createColumnHelper } from '@tanstack/react-table';

import AuditAction from '../elements/AuditAction';
import AuditDetails from '../elements/AuditDetails';

const columnHelper = createColumnHelper<ITableAuditLog>();

const columnAuditLogDef = [
  columnHelper.accessor('user', {
    id: 'User',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('action', {
    id: 'Action',
    enableSorting: false,
    cell: (info) => <AuditAction action={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('entity', {
    id: 'Entity',
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('entity_id', {
    id: 'Entity ID',
    enableColumnFilter: false,
    enableSorting: false,
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.display({
    id: 'Changes',
    cell: () => <AuditDetails />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('date', {
    id: 'Date',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
];

export default columnAuditLogDef;
