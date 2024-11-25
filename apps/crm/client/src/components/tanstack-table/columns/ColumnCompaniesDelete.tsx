import { createColumnHelper } from '@tanstack/react-table';

import { ITableDataCompanies } from '#Data/MockData';

import { CompanySingle, UserSingle } from '../elements';

const columnHelper = createColumnHelper<ITableDataCompanies>();

const columnCompaniesDeleteDef = [
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
    cell: (info) => info.getValue(),
    header: ({ column }) => <span>{column.id}</span>,
    enableColumnFilter: false,
    enableGlobalFilter: false,
  }),
];

export default columnCompaniesDeleteDef;
