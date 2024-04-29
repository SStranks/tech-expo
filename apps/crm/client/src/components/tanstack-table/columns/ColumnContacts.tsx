import { ITableDataContacts } from '#Data/MockData';
import { createColumnHelper } from '@tanstack/react-table';
import RowActions from '../RowActions';

const columnHelper = createColumnHelper<ITableDataContacts>();

const columnContactsDef = [
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor('email', { cell: (info) => info.getValue(), header: () => <span>Email</span> }),
  columnHelper.accessor('company', { cell: (info) => info.getValue(), header: () => <span>Company</span> }),
  columnHelper.accessor('title', { cell: (info) => info.getValue(), header: () => <span>Title</span> }),
  columnHelper.accessor('status', {
    cell: (info) => info.getValue(),
    header: () => <span>Status</span>,
    enableGlobalFilter: false,
  }),
  columnHelper.display({ id: 'actions', cell: () => <RowActions />, header: () => <span>Actions</span> }),
];

export default columnContactsDef;
