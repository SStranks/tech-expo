import type { CoreRow } from '@tanstack/react-table';
import type { ITableDataContacts } from '#Data/MockData';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import FormModal from '#Components/modal/FormModal';
import { TableContactsDelete } from '#Components/tanstack-table/tables';
import { StylesTableListView } from '#Components/tanstack-table/views';

function ContactsDeletePage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  const navigate = useNavigate();
  // TODO:  Change assertion to runtime check later, using type guard.
  // TODO:  Apply this approach to the other components using useLocation.
  const state = useLocation().state as CoreRow<ITableDataContacts>['original'];
  const [id] = useState(() => state.id);

  useEffect(() => {
    setPortalActiveInternal(true);
  }, [setPortalActiveInternal]);

  useEffect(() => {
    const tableRow = document.querySelector(`[data-table-row-id="${id}"]`);
    tableRow?.classList.add(StylesTableListView.dangerRow);

    return () => tableRow?.classList.remove(StylesTableListView.dangerRow);
  }, [id]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
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
