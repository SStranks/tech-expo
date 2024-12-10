import { Outlet } from 'react-router-dom';

import ViewportLayout from '@Layouts/ViewportLayout';

import styles from './CompaniesRoute.module.scss';

function CompaniesRoute(): React.JSX.Element {
  return (
    <ViewportLayout>
      <div className={styles.contactsRouteLayout}>
        <div className={styles.table}>
          <Outlet />
        </div>
      </div>
    </ViewportLayout>
  );
}

export default CompaniesRoute;
