import type { Table } from '@tanstack/react-table';
import type { ITableDataContacts } from '#Data/MockData';
import { TableViewGrid, TableGridCard } from '#Components/tanstack-table/views/grid';
import TableContactsCardUpper from '#Components/tanstack-table/cards/contacts/TableContactsCardUpper';
import TableContactsCardLower from '#Components/tanstack-table/cards/contacts/TableContactsCardLower';
// import styles from './_TableContacts.module.scss';

interface IProps {
  table: Table<ITableDataContacts>;
}

function TableContactGrid(props: IProps): JSX.Element {
  const { table } = props;

  // const globalFilteredRows = table
  //   .getPreFilteredRowModel()
  //   .rows.filter((row) => row.columnFilters['__global__'] !== false);
  // const tableCards = globalFilteredRows.map((row) => {
  const tableCards = table.getRowModel().rows.map((row) => {
    const { id, name, email, status, title } = row.original;
    const upperSection = <TableContactsCardUpper img={'image'} name={name} email={email} status={status} />;
    const lowerSection = <TableContactsCardLower role={title} companyImg={'image'} companyName={'test'} />;

    return <TableGridCard key={id} upperSection={upperSection} lowerSection={lowerSection} />;
  });

  return <TableViewGrid>{tableCards}</TableViewGrid>;
}

export default TableContactGrid;
