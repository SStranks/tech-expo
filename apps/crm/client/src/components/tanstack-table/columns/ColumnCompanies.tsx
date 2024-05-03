import { ITableDataCompanies } from '#Data/MockData';
import { createColumnHelper } from '@tanstack/react-table';
import { RowActionsControl } from '../controls';

const columnHelper = createColumnHelper<ITableDataCompanies>();

const columnCompaniesDef = [
  columnHelper.accessor('companyTitle', {
    id: 'Company',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('salesOwner', {
    id: 'Sales Owner',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('openDealsAmount', {
    id: 'Open Deals Total',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableGlobalFilter: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor('relatedContacts', {
    id: 'Related Contacts',
    cell: (info) => <span>{info.getValue().join(' + ')}</span>,
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'Actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.ViewControl entryId={row.id} />
        <RowActionsControl.UpdateControl entryId={row.id} />
      </RowActionsControl>
    ),
    header: ({ column }) => <span>{column.id}</span>,
  }),
];

export default columnCompaniesDef;
