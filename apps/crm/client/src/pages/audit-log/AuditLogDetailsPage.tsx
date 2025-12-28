import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import TableAuditLogDetails from '@Components/tanstack-table/tables/audit-log/TableAuditLogDetails';
import { tableDataAuditLogDetails } from '@Data/MockData';

function AuditLogDetailsPage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const navigate = useNavigate();

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormModal.Header title="Audit Log: <INSERT DYNAMIC>" />
      <TableAuditLogDetails tableData={tableDataAuditLogDetails} />
      <FormModal.Footer>
        <FormModal.CancelButton />
        <FormModal.OkayButton />
      </FormModal.Footer>
    </FormModal>
  );
}

export default AuditLogDetailsPage;
