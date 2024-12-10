import { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';

import { useReduxSelector } from '@Redux/hooks';

import './Calendar.scss';

const calendarEvents = [
  {
    id: '1',
    end: '2024-08-21',
    start: '2024-08-21',
    title: 'Event',
  },
];

function Calendar(): React.JSX.Element {
  const reduxState = useReduxSelector((state) => state.theme.isDarkMode);
  const calendar = useCalendarApp({
    events: calendarEvents,
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
  });

  calendar.setTheme(reduxState ? 'dark' : 'light');

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default Calendar;
