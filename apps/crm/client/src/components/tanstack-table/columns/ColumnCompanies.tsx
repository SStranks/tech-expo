import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataCompanies } from '#Data/MockData';

import { RowActionsControl } from '../controls';
import { CompanySingle, UserSingle } from '../elements';
import RelatedContacts from '../elements/RelatedContacts';

const columnHelper = createColumnHelper<ITableDataCompanies>();

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
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('relatedContacts', {
    id: 'Related Contacts',
    cell: (info) => <RelatedContacts relatedContacts={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
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
