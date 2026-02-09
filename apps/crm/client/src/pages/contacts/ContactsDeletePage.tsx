import type { CoreRow } from '@tanstack/react-table';

import type { TableDataContacts } from '@Data/MockData';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import TableContactsDelete from '@Components/tanstack-table/tables/contacts/TableContactsDelete';

import StylesTableListView from '@Components/tanstack-table/views/TableListView.module.scss';

function ContactsDeletePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const navigate = useNavigate();
  // TODO:  Change assertion to runtime check later, using type guard.
  // TODO:  Apply this approach to the other components using useLocation.
  const state = useLocation().state as CoreRow<TableDataContacts>['original'];
  const [id] = useState(() => state.id);

  useEffect(() => {
    const tableRow = document.querySelector(`[data-table-row-id="${id}"]`);
    tableRow?.classList.add(StylesTableListView.dangerRow);

    return () => tableRow?.classList.remove(StylesTableListView.dangerRow);
  }, [id]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormModal.Header title="Delete Contact: <INSERT DYNAMIC ID>" />
      <TableContactsDelete tableData={[state]} />
      <FormModal.Footer>
        <FormModal.CancelButton />
        <FormModal.DeleteButton />
      </FormModal.Footer>
    </FormModal>
  );
}

export default ContactsDeletePage;
