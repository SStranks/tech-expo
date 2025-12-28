import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataQuotes } from '@Data/MockData';

import RowActionsControl from '../controls/actions-row/RowActionsControl';
import CompanySingle from '../elements/CompanySingle';
import QuoteParticipants from '../elements/QuoteParticipants';
import QuoteStage from '../elements/QuoteStage';

const columnHelper = createColumnHelper<ITableDataQuotes>();

const columnQuotesDef = [
  columnHelper.accessor('title', {
    cell: (info) => info.getValue(),
    header: () => <span>Title</span>,
  }),
  columnHelper.accessor('company', {
    cell: (info) => <CompanySingle companyName={info.getValue()} />,
    header: () => <span>Company</span>,
  }),
  columnHelper.accessor('total amount', {
    enableColumnFilter: false,
    enableGlobalFilter: false,
    cell: (info) => info.getValue(),
    header: () => <span>Total Amount</span>,
  }),
  columnHelper.accessor('stage', {
    enableGlobalFilter: false,
    cell: (info) => <QuoteStage stage={info.getValue()} />,
    header: () => <span>Stage</span>,
  }),
  columnHelper.accessor((row) => ({ preparedBy: row['prepared by'], preparedFor: row['prepared for'] }), {
    id: 'participants',
    cell: (info) => (
      <QuoteParticipants participantBy={info.getValue().preparedBy} participantFor={info.getValue().preparedFor} />
    ),
    header: () => <span>Participants</span>,
  }),
  columnHelper.accessor('created at', {
    enableColumnFilter: false,
    enableGlobalFilter: false,
    cell: (info) => info.getValue(),
    header: () => <span>Created At</span>,
  }),
  columnHelper.display({
    id: 'Actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.ViewControl entryId={row.id} />
        <RowActionsControl.UpdateControl rowOriginal={row.original} />
        <RowActionsControl.DeleteControl rowOriginal={row.original} />
      </RowActionsControl>
    ),
    header: () => <span>Actions</span>,
  }),
];

export default columnQuotesDef;
