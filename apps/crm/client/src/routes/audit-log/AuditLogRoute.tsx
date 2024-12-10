import { Outlet } from 'react-router-dom';

import ViewportLayout from '@Layouts/ViewportLayout';

import styles from './AuditlogRoute.module.scss';

function AuditLogRoute(): React.JSX.Element {
  return (
    <ViewportLayout>
      <div className={styles.auditLogRouteLayout}>
        <div className={styles.table}>
          <Outlet />
        </div>
      </div>
    </ViewportLayout>
  );
}

export default AuditLogRoute;
