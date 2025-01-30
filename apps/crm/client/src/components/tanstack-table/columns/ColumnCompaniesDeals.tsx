import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataDeals } from '@Data/MockData';

import { RowActionsControl } from '../controls';
import { DealParticipants } from '../elements';

const columnHelper = createColumnHelper<ITableDataDeals>();

const columnCompaniesDealssDef = [
  columnHelper.accessor('title', {
    id: 'Title',
    enableSorting: false,
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('amount', {
    id: 'Deal Amount',
    enableColumnFilter: false,
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('stage', {
    id: 'Stage',
    enableSorting: false,
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor((row) => ({ dealContact: row['dealContact'], dealOwner: row['dealOwner'] }), {
    id: 'Participants',
    enableSorting: false,
    cell: (info) => (
      <DealParticipants dealOwner={info.getValue().dealOwner} dealContact={info.getValue().dealContact} />
    ),
    header: () => <span>Participants</span>,
  }),
  columnHelper.display({
    id: 'Actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.ViewControl entryId={row.id} />
      </RowActionsControl>
    ),
    header: ({ column }) => <span>{column.id}</span>,
  }),
];

export default columnCompaniesDealssDef;
