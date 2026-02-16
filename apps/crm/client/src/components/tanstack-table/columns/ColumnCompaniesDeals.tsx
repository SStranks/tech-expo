import type { TableDataDeals } from '@Data/MockData';

import { createColumnHelper } from '@tanstack/react-table';

import RowActionsControl from '../controls/actions-row/RowActionsControl';
import DealParticipants from '../elements/DealParticipants';

const columnHelper = createColumnHelper<TableDataDeals>();

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
    header: () => <span>Participants</span>,
    cell: (info) => (
      <DealParticipants dealOwner={info.getValue().dealOwner} dealContact={info.getValue().dealContact} />
    ),
  }),
  columnHelper.display({
    id: 'Actions',
    header: ({ column }) => <span>{column.id}</span>,
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.ViewControl entryId={row.id} />
      </RowActionsControl>
    ),
  }),
];

export default columnCompaniesDealssDef;
