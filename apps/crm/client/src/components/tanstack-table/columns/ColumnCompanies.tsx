import { createColumnHelper } from '@tanstack/react-table';

import { TableDataCompanies } from '@Data/MockData';

import RowActionsControl from '../controls/actions-row/RowActionsControl';
import CompanySingle from '../elements/CompanySingle';
import RelatedContacts from '../elements/RelatedContacts';
import UserSingle from '../elements/UserSingle';

const columnHelper = createColumnHelper<TableDataCompanies>();

const columnCompaniesDef = [
  columnHelper.accessor('companyTitle', {
    id: 'Company',
    cell: (info) => <CompanySingle companyName={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('salesOwner', {
    id: 'Sales Owner',
    cell: (info) => <UserSingle userName={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('openDealsAmount', {
    id: 'Open Deals Total',
    enableColumnFilter: false,
    enableGlobalFilter: false,
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('relatedContacts', {
    id: 'Related Contacts',
    enableSorting: false,
    cell: (info) => <RelatedContacts relatedContacts={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.display({
    id: 'Actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.ViewControl entryId={row.id} />
        <RowActionsControl.DeleteControl rowOriginal={row.original} />
      </RowActionsControl>
    ),
    header: ({ column }) => <span>{column.id}</span>,
  }),
];

export default columnCompaniesDef;
