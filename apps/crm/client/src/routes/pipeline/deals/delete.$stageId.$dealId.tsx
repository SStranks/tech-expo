import { createFileRoute, redirect } from '@tanstack/react-router';

import PiplineDealsDeletePage from '@Pages/pipeline/PipelineDealsDeletePage';

export const Route = createFileRoute('/pipeline/deals/delete/$stageId/$dealId')({
  component: PiplineDealsDeletePage,
  beforeLoad: ({ params }) => {
    if (!params.stageId) {
      throw redirect({ replace: true, to: '/pipeline' });
    }
  },
});
