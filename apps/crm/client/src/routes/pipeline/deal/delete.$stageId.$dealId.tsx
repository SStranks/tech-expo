import { createFileRoute, redirect } from '@tanstack/react-router';

import PiplineDealDeletePage from '@Pages/pipeline/PipelineDealDeletePage';

export const Route = createFileRoute('/pipeline/deal/delete/$stageId/$dealId')({
  component: PiplineDealDeletePage,
  beforeLoad: ({ params }) => {
    if (params.dealId || params.stageId) {
      throw redirect({ replace: true, to: '/pipeline' });
    }
  },
});
