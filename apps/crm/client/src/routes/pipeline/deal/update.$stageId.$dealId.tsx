import { createFileRoute } from '@tanstack/react-router';

import PipelineDealUpdatePage from '@Pages/pipeline/PipelineDealUpdatePage';

export const Route = createFileRoute('/pipeline/deal/update/$stageId/$dealId')({
  component: PipelineDealUpdatePage,
});
