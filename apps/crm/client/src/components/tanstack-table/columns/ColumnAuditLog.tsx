import { createColumnHelper } from '@tanstack/react-table';
import { ITableAuditLog } from '#Data/MockData';
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
    cell: (info) => <AuditAction action={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
  }),
  columnHelper.accessor('entity', {
    id: 'Entity',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableColumnFilter: false,
    enableSorting: false,
  }),
  columnHelper.accessor('entity_id', {
    id: 'Entity ID',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableColumnFilter: false,
    enableSorting: false,
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
