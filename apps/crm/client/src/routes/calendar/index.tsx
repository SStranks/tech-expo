import { createFileRoute } from '@tanstack/react-router';

import CalendarPage from '@Pages/calendar/CalendarPage';

export const Route = createFileRoute('/calendar/')({
  component: CalendarPage,
});
