import { Outlet } from 'react-router-dom';

import ViewportLayout from '#Layouts/ViewportLayout';

function AdministrationRoute(): JSX.Element {
  return (
    <ViewportLayout>
      <Outlet />
    </ViewportLayout>
  );
}

export default AdministrationRoute;
