import type { TableDataContacts } from '@Data/MockData';

import type { TableContactsDeleteFeatures } from '../tables/contacts/TableContactsDelete';

import { createColumnHelper } from '@tanstack/react-table';

import ContactStatus from '../elements/ContactStatus';
import UserSingle from '../elements/UserSingle';

const columnHelper = createColumnHelper<TableContactsDeleteFeatures, TableDataContacts>();

const columnContactsDeleteDef = columnHelper.columns([
  columnHelper.accessor('name', {
    cell: (info) => <UserSingle userName={info.getValue()} />,
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor('company', { cell: (info) => info.getValue(), header: () => <span>Company</span> }),
  columnHelper.accessor('status', {
    enableColumnFilter: false,
    enableGlobalFilter: false,
    cell: (info) => <ContactStatus status={info.getValue()} />,
    header: () => <span>Status</span>,
  }),
]);

export default columnContactsDeleteDef;
