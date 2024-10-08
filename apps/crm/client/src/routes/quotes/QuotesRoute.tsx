import { Outlet } from 'react-router-dom';
import ViewportLayout from '#Layouts/ViewportLayout';
import styles from './_QuotesRoute.module.scss';

function QuotesRoute(): JSX.Element {
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
