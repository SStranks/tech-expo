import OutletPortalTransition from '#Components/react-transition-group/OutletPortalTransition';
import { TableContacts } from '#Components/tanstack-table/tables';
import { tableDataContacts } from '#Data/MockData';

function ContactsPage(): JSX.Element {
  return (
    <>
      <TableContacts tableData={tableDataContacts} />
      <OutletPortalTransition />
    </>
  );
}

export default ContactsPage;
