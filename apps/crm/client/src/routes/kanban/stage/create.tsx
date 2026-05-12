import { createFileRoute } from '@tanstack/react-router';

import KanbanStageCreatePage from '@Pages/kanban/KanbanStageCreatePage';

export const Route = createFileRoute('/kanban/stage/create')({
  component: KanbanStageCreatePage,
});
