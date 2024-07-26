import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FormModal from '#Components/modal/FormModal';
import { StylesTableListView } from '#Components/tanstack-table/views';
import { TableContactsDelete } from '#Components/tanstack-table/tables';

function ContactsDeletePage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  const navigate = useNavigate();
  let { state } = useLocation();
  const { id } = useParams();

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
