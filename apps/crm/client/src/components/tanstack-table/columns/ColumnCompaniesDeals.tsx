import { ITableDataDeals } from '#Data/MockData';
import { createColumnHelper } from '@tanstack/react-table';
import { RowActionsControl } from '../controls';
import { DealParticipants } from '../elements';

const columnHelper = createColumnHelper<ITableDataDeals>();

const columnCompaniesDealssDef = [
  columnHelper.accessor('title', {
    id: 'Title',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
  }),
  columnHelper.accessor('amount', {
    id: 'Deal Amount',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableColumnFilter: false,
  }),
  columnHelper.accessor('stage', {
    id: 'Stage',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
  }),
  columnHelper.accessor((row) => ({ dealOwner: row['dealOwner'], dealContact: row['dealContact'] }), {
    id: 'Participants',
    cell: (info) => (
      <DealParticipants dealOwner={info.getValue().dealOwner} dealContact={info.getValue().dealContact} />
    ),
    header: () => <span>Participants</span>,
    enableSorting: false,
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
