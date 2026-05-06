import type { SearchParam } from '../../utils/routeSearchParams';

import { Outlet } from 'react-router-dom';

import ViewportLayout from '@Layouts/ViewportLayout';

import { createSearchParams } from '../../utils/routeSearchParams';

type StageIdentitySearch = SearchParam<'stageId'>;
type DealIdentitySearch = SearchParam<'dealId'>;

export const dealCreateParams = createSearchParams<StageIdentitySearch>(['stageId']);
export const dealUpdateParams = createSearchParams<StageIdentitySearch & DealIdentitySearch>(['stageId', 'dealId']);

function PipelineRoute(): React.JSX.Element {
  return (
    <ViewportLayout>
      <Outlet />
    </ViewportLayout>
  );
}

export default PipelineRoute;
