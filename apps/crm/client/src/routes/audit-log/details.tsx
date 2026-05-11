import { createFileRoute } from '@tanstack/react-router';

import AuditLogDetailsPage from '@Pages/audit-log/AuditLogDetailsPage';

export const Route = createFileRoute('/audit-log/details')({
  component: AuditLogDetailsPage,
});
