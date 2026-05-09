import { createFileRoute } from '@tanstack/react-router';

import KanbanPage from '@Pages/kanban/KanbanPage';

export const Route = createFileRoute('/kanban/')({
  component: KanbanPage,
});
