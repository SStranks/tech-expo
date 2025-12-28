import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataQuotes } from '@Data/MockData';

import RowActionsControl from '../controls/actions-row/RowActionsControl';
import QuoteParticipants from '../elements/QuoteParticipants';
import QuoteStage from '../elements/QuoteStage';
import UserSingle from '../elements/UserSingle';

const columnHelper = createColumnHelper<ITableDataQuotes>();

const columnCompaniesQuotesDef = [
  columnHelper.accessor('title', {
    id: 'Quote Title',
    enableSorting: false,
    cell: (info) => <UserSingle userName={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('total amount', {
    id: 'Total Amount',
    enableSorting: false,
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor('stage', {
    id: 'Stage',
    enableGlobalFilter: false,
    enableSorting: false,
    cell: (info) => <QuoteStage stage={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
  }),
  columnHelper.accessor((row) => ({ preparedBy: row['prepared by'], preparedFor: row['prepared for'] }), {
    id: 'participants',
    enableSorting: false,
    cell: (info) => (
      <QuoteParticipants participantBy={info.getValue().preparedBy} participantFor={info.getValue().preparedFor} />
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

export default columnCompaniesQuotesDef;
