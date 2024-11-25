import { Outlet } from 'react-router-dom';

import ViewportLayout from '#Layouts/ViewportLayout';

function ScrumboardRoute(): JSX.Element {
  return (
    <ViewportLayout>
      <Outlet />
    </ViewportLayout>
  );
}

export default ScrumboardRoute;
