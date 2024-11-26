import { Outlet } from 'react-router-dom';

import ViewportLayout from '@Layouts/ViewportLayout';

function KanbanRoute(): JSX.Element {
  return (
    <ViewportLayout>
      <Outlet />
    </ViewportLayout>
  );
}

export default KanbanRoute;
