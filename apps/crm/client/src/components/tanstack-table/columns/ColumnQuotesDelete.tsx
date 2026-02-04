import type { TableDataQuotes } from '@Data/MockData';

import { createColumnHelper } from '@tanstack/react-table';

import CompanySingle from '../elements/CompanySingle';
import QuoteStage from '../elements/QuoteStage';

const columnHelper = createColumnHelper<TableDataQuotes>();

const columnQuotesDeleteDef = [
  columnHelper.accessor('title', {
    cell: (info) => info.getValue(),
    header: () => <span>Title</span>,
  }),
  columnHelper.accessor('company', {
    cell: (info) => <CompanySingle companyName={info.getValue()} />,
    header: () => <span>Company</span>,
  }),
  columnHelper.accessor('total amount', {
    cell: (info) => info.getValue(),
    header: () => <span>Total Amount</span>,
  }),
  columnHelper.accessor('stage', {
    cell: (info) => <QuoteStage stage={info.getValue()} />,
    header: () => <span>Stage</span>,
  }),
];

export default columnQuotesDeleteDef;
