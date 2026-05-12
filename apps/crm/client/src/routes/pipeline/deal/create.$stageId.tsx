import { createFileRoute, redirect } from '@tanstack/react-router';

import PipelineDealCreatePage from '@Pages/pipeline/PipelineDealCreatePage';

export const Route = createFileRoute('/pipeline/deal/create/$stageId')({
  component: PipelineDealCreatePage,
  beforeLoad: ({ params }) => {
    if (!params.stageId) {
      throw redirect({ replace: true, to: '/pipeline' });
    }
  },
});
