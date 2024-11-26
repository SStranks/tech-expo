import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataQuotes } from '@Data/MockData';

import { CompanySingle, QuoteStage } from '../elements';

const columnHelper = createColumnHelper<ITableDataQuotes>();

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
