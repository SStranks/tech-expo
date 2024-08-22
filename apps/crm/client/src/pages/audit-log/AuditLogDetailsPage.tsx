import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormModal from '#Components/modal/FormModal';
import { TableAuditLogDetails } from '#Components/tanstack-table/tables';
import { tableDataAuditLogDetails } from '#Data/MockData';

function AuditLogDetailsPage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPortalActiveInternal(true);
  }, [setPortalActiveInternal]);

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
