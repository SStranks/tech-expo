import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
// import TableQuotesDelete from '@Components/tanstack-table/tables/quotes/TableQuotesDelete';

import StylesTableListView from '@Components/tanstack-table/views/TableListView.module.scss';

function QuoteDeletePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const navigate = useNavigate();
  const { quoteId } = useParams();

  useEffect(() => {
    if (!quoteId) return;
    const tableRow = document.querySelector(`tr[data-table-row-id="${quoteId}"]`);
    tableRow?.classList.add(StylesTableListView.dangerRow);

    return () => tableRow?.classList.remove(StylesTableListView.dangerRow);
  }, [quoteId]);

  if (!quoteId) return <Navigate to="/quotes" replace />;

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormModal.Header title="Delete Quote: <INSERT DYNAMIC ID>" />
      {/* <TableQuotesDelete tableData={[state]} /> */}
      <FormModal.Footer>
        <FormModal.CancelButton />
        <FormModal.DeleteButton />
      </FormModal.Footer>
    </FormModal>
  );
}

export default QuoteDeletePage;
