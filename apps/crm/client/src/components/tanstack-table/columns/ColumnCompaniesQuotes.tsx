import { createColumnHelper } from '@tanstack/react-table';
import { ITableDataQuotes } from '#Data/MockData';
import { RowActionsControl } from '../controls';
import { QuoteParticipants, QuoteStage, UserSingle } from '../elements';

const columnHelper = createColumnHelper<ITableDataQuotes>();

const columnCompaniesQuotesDef = [
  columnHelper.accessor('title', {
    id: 'Quote Title',
    cell: (info) => <UserSingle userName={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
  }),
  columnHelper.accessor('total amount', {
    id: 'Total Amount',
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableSorting: false,
  }),
  columnHelper.accessor('stage', {
    id: 'Stage',
    cell: (info) => <QuoteStage stage={info.getValue()} />,
    header: ({ column }) => <span>{column.id}</span>,
    enableGlobalFilter: false,
    enableSorting: false,
  }),
  columnHelper.accessor((row) => ({ preparedBy: row['prepared by'], preparedFor: row['prepared for'] }), {
    id: 'participants',
    cell: (info) => (
      <QuoteParticipants participantBy={info.getValue().preparedBy} participantFor={info.getValue().preparedFor} />
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

export default columnCompaniesQuotesDef;
