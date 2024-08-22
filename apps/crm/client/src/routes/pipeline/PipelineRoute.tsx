import { Outlet } from 'react-router-dom';
import ViewportLayout from '#Layouts/ViewportLayout';

function PipelineRoute(): JSX.Element {
  return (
    <ViewportLayout>
      <Outlet />
    </ViewportLayout>
  );
}

export default PipelineRoute;
