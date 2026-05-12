import { createFileRoute, redirect } from '@tanstack/react-router';

import KanbanTaskCreatePage from '@Pages/kanban/KanbanTaskCreatePage';

export const Route = createFileRoute('/kanban/task/create/$stageId')({
  component: KanbanTaskCreatePage,
  beforeLoad: ({ params }) => {
    if (!params.stageId) {
      throw redirect({ replace: true, to: '/kanban' });
    }
  },
});
