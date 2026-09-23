import type { TableDataCompanies } from '@Data/MockData';

import type { TableCompaiesDeleteFeatures } from '../tables/companies/TableCompaniesDelete';

import { createColumnHelper } from '@tanstack/react-table';

import CompanySingle from '../elements/CompanySingle';
import UserSingle from '../elements/UserSingle';

const columnHelper = createColumnHelper<TableCompaiesDeleteFeatures, TableDataCompanies>();

const columnCompaniesDeleteDef = columnHelper.columns([
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
    enableColumnFilter: false,
    enableGlobalFilter: false,
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
  }),
]);

export default columnCompaniesDeleteDef;
