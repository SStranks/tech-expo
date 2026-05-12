import { createFileRoute } from '@tanstack/react-router';

import KanbanTaskUpdatePage from '@Pages/kanban/KanbanTaskUpdatePage';

export const Route = createFileRoute('/kanban/task/update/$taskId')({
  component: KanbanTaskUpdatePage,
});
