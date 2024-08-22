import OutletPortalTransition from '#Components/react-transition-group/OutletPortalTransition';
import TableAuditLog from '#Components/tanstack-table/tables/audit-log/TableAuditLog';
import { tableDataAuditLog } from '#Data/MockData';

function AuditLogPage(): JSX.Element {
  return (
    <>
      <TableAuditLog tableData={tableDataAuditLog} />
      <OutletPortalTransition />
    </>
  );
}

export default AuditLogPage;
