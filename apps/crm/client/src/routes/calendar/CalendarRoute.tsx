import { Outlet } from 'react-router-dom';

import ViewportLayout from '@Layouts/ViewportLayout';

function CalendarRoute(): React.JSX.Element {
  return (
    <ViewportLayout>
      <Outlet />
    </ViewportLayout>
  );
}

export default CalendarRoute;
