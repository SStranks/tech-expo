import { Outlet } from 'react-router-dom';

import ViewportLayout from '@Layouts/ViewportLayout';

import styles from './QuotesRoute.module.scss';

function QuotesRoute(): React.JSX.Element {
  return (
    <ViewportLayout>
      <div className={styles.quotesRouteLayout}>
        <div className={styles.table}>
          <Outlet />
        </div>
      </div>
    </ViewportLayout>
  );
}

export default QuotesRoute;
