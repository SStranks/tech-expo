import { createFileRoute, redirect } from '@tanstack/react-router';

import PiplineStageDeletePage from '@Pages/pipeline/PipelineStageDeletePage';

export const Route = createFileRoute('/pipeline/stage/delete/$stageId')({
  component: PiplineStageDeletePage,
  beforeLoad: ({ params }) => {
    if (!params.stageId) {
      throw redirect({
        replace: true,
        to: '/pipeline',
      });
    }
  },
});
