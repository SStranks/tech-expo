import { Outlet } from 'react-router-dom';

import ViewportLayout from '@Layouts/ViewportLayout';

function DashboardRoute(): JSX.Element {
  return (
    <ViewportLayout>
      <Outlet />
    </ViewportLayout>
  );
}

export default DashboardRoute;
