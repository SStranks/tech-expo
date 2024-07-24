import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormModal from '#Components/modal/FormModal';
import { StylesTableListView } from '#Components/tanstack-table/views';

function QuoteDeletePage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setPortalActiveInternal(true);
  }, [setPortalActiveInternal]);

  useEffect(() => {
    const tableRow = document.querySelector(`tr[data-table-row-id="${id}"]`);
    tableRow?.classList.add(StylesTableListView.dangerRow);

    return () => tableRow?.classList.remove(StylesTableListView.dangerRow);
  }, [id]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormModal.Header title="Delete Quote: <INSERT DYNAMIC ID>" />
      {/* <TableAuditLogDetails tableData={tableDataAuditLogDetails} /> */}
      <FormModal.Footer>
        <FormModal.CancelButton />
        <FormModal.DeleteButton />
      </FormModal.Footer>
    </FormModal>
  );
}

export default QuoteDeletePage;
