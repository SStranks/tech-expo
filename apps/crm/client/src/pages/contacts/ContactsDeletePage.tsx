import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import FormModal from '@Components/modal/FormModal';
// import TableContactsDelete from '@Components/tanstack-table/tables/contacts/TableContactsDelete';

import StylesTableListView from '@Components/tanstack-table/views/TableListView.module.scss';

function ContactsDeletePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const navigate = useNavigate();
  const { id } = useParams({ from: '/contacts/delete/$id' });

  useEffect(() => {
    const tableRow = document.querySelector(`[data-table-row-id="${id}"]`);
    tableRow?.classList.add(StylesTableListView.dangerRow);

    return () => tableRow?.classList.remove(StylesTableListView.dangerRow);
  }, [id]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate({ to: '/contacts' });
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormModal.Header title="Delete Contact: <INSERT DYNAMIC ID>" />
      {/* // TODO: Setup contacts redux slice + RTK Query; use id to retrieve company data and pass into TableContactsDelete component.  */}
      {/* <TableContactsDelete tableData={[state]} /> */}
      <FormModal.Footer>
        <FormModal.CancelButton />
        <FormModal.DeleteButton />
      </FormModal.Footer>
    </FormModal>
  );
}

export default ContactsDeletePage;
