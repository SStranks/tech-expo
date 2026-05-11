import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import FormModal from '@Components/modal/FormModal';
import TableCompaniesDelete from '@Components/tanstack-table/tables/companies/TableCompaniesDelete';

import StylesTableListView from '@Components/tanstack-table/views/TableListView.module.scss';

function CompaniesDeletePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const navigate = useNavigate();
  const { id } = useParams({ from: '/companies/delete/$id' });

  useEffect(() => {
    const tableRow = document.querySelector(`[data-table-row-id="${id}"]`);
    tableRow?.classList.add(StylesTableListView.dangerRow);

    return () => tableRow?.classList.remove(StylesTableListView.dangerRow);
  }, [id]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate({ to: '/companies' });
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      {/* // TODO: Dynamic Id */}
      <FormModal.Header title="Delete Company: <INSERT DYNAMIC ID>" />
      <TableCompaniesDelete tableData={[state]} />
      <FormModal.Footer>
        <FormModal.CancelButton />
        <FormModal.DeleteButton />
      </FormModal.Footer>
    </FormModal>
  );
}

export default CompaniesDeletePage;
