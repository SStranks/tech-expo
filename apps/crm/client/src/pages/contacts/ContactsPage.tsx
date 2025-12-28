import OutletPortalTransition from '@Components/react-transition-group/OutletPortalTransition';
import TableContacts from '@Components/tanstack-table/tables/contacts/TableContacts';
import { tableDataContacts } from '@Data/MockData';

function ContactsPage(): React.JSX.Element {
  return (
    <>
      <TableContacts tableData={tableDataContacts} />
      <OutletPortalTransition />
    </>
  );
}

export default ContactsPage;
