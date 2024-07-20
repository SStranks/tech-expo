import { Outlet } from 'react-router-dom';
import ViewportLayout from '#Layouts/ViewportLayout';

function SettingsRoute(): JSX.Element {
  return (
    <ViewportLayout>
      <Outlet />
    </ViewportLayout>
  );
}

export default SettingsRoute;
