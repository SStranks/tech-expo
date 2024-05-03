import { ITableDataCompanies } from '#Data/MockData';
import { Row, createColumnHelper } from '@tanstack/react-table';
import { RowActionsControl } from '../controls';

const viewControlClickFn = (row: Row<ITableDataCompanies>) => {
  return () => alert(`${row.original.companyTitle}: view control`);
};

const DeleteControlClickFn = (row: Row<ITableDataCompanies>) => {
  return () => alert(`${row.original.companyTitle}: delete control`);
};

const columnHelper = createColumnHelper<ITableDataCompanies>();

const columnCompaniesDef = [
  columnHelper.accessor('companyTitle', {
    cell: (info) => info.getValue(),
    header: () => <span>Company</span>,
  }),
  columnHelper.accessor('salesOwner', { cell: (info) => info.getValue(), header: () => <span>Sales Owner</span> }),
  columnHelper.accessor('openDealsAmount', {
    cell: (info) => info.getValue(),
    header: () => <span>Open Deals Total</span>,
    enableGlobalFilter: false,
    enableColumnFilter: false,
  }),
  columnHelper.accessor('relatedContacts', {
    cell: (info) => <span>{info.getValue().join(' + ')}</span>,
    header: () => <span>Related Contacts</span>,
    enableSorting: false,
  }),
  columnHelper.display({
    id: 'actions',
    cell: ({ row }) => (
      <RowActionsControl>
        <RowActionsControl.ViewControl onClick={viewControlClickFn(row)} />
        <RowActionsControl.DeleteControl onClick={DeleteControlClickFn(row)} />
      </RowActionsControl>
    ),
    header: () => <span>Actions</span>,
  }),
];

export default columnCompaniesDef;
