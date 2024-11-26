import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataContacts } from '@Data/MockData';

import { ContactStatus, UserSingle } from '../elements';

const columnHelper = createColumnHelper<ITableDataContacts>();

const columnContactsDeleteDef = [
  columnHelper.accessor('name', {
    cell: (info) => <UserSingle userName={info.getValue()} />,
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor('company', { cell: (info) => info.getValue(), header: () => <span>Company</span> }),
  columnHelper.accessor('status', {
    cell: (info) => <ContactStatus status={info.getValue()} />,
    header: () => <span>Status</span>,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
];

export default columnContactsDeleteDef;
