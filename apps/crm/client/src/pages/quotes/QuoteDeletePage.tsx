import type { CoreRow } from '@tanstack/react-table';

import type { ITableDataQuotes } from '@Data/MockData';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import { TableQuotesDelete } from '@Components/tanstack-table/tables';
import { StylesTableListView } from '@Components/tanstack-table/views';

function QuoteDeletePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const navigate = useNavigate();
  // TODO:  Change assertion to runtime check later, using type guard.
  // TODO:  Apply this approach to the other components using useLocation.
  const state = useLocation().state as CoreRow<ITableDataQuotes>['original'];
  const [id] = useState(() => state.id);

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
      <TableQuotesDelete tableData={[state]} />
      <FormModal.Footer>
        <FormModal.CancelButton />
        <FormModal.DeleteButton />
      </FormModal.Footer>
    </FormModal>
  );
}

export default QuoteDeletePage;
