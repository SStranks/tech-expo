import OutletPortalTransition from '#Components/react-transition-group/OutletPortalTransition';
import { Calendar } from '#Features/calendar';
// import styles from './_CalendarPage.module.scss';

function CalendarPage(): JSX.Element {
  return (
    <>
      <Calendar />
      <OutletPortalTransition />
    </>
  );
}

export default CalendarPage;
