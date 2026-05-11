import { createFileRoute } from '@tanstack/react-router';

import PipelineStageCreatePage from '@Pages/pipeline/PipelineStageCreatePage';

export const Route = createFileRoute('/pipeline/stage/create')({
  component: PipelineStageCreatePage,
});
