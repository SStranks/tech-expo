import { createViewDay, createViewMonthAgenda, createViewMonthGrid, createViewWeek } from '@schedule-x/calendar';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { useReduxSelector } from '#Redux/hooks';
import './_Calendar.scss';

const calendarEvents = [
  {
    id: '1',
    title: 'Event',
    start: '2024-08-21',
    end: '2024-08-21',
  },
];

function Calendar(): JSX.Element {
  const reduxState = useReduxSelector((state) => state.theme.isDarkMode);
  const calendar = useCalendarApp({
    views: [createViewDay(), createViewWeek(), createViewMonthGrid(), createViewMonthAgenda()],
    events: calendarEvents,
  });

  calendar.setTheme(reduxState ? 'dark' : 'light');

  return (
    <div>
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}

export default Calendar;
