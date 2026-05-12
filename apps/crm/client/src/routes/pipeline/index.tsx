import { createFileRoute } from '@tanstack/react-router';

import PipelinePage from '@Pages/pipeline/PipelinePage';

export const Route = createFileRoute('/pipeline/')({
  component: PipelinePage,
});
