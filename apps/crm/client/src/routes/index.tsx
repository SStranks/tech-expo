import { createFileRoute } from '@tanstack/react-router';

import DashboardPage from '@Pages/dashboard/DashboardPage';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});
