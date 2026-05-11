import { createFileRoute, redirect } from '@tanstack/react-router';

import PipelineStageUpdatePage from '@Pages/pipeline/PipelineStageUpdatePage';

export const Route = createFileRoute('/pipeline/stage/update/$stageId')({
  component: PipelineStageUpdatePage,
  beforeLoad: ({ params }) => {
    if (!params.stageId) {
      throw redirect({
        replace: true,
        to: '/pipeline',
      });
    }
  },
});
