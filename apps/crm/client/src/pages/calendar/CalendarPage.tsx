import OutletPortalTransition from '@Components/react-transition-group/OutletPortalTransition';
import Calendar from '@Features/calendar/Calendar';

function CalendarPage(): React.JSX.Element {
  return (
    <>
      <Calendar />
      <OutletPortalTransition />
    </>
  );
}

export default CalendarPage;
