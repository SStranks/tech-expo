export type Styles = {
  button: string;
  button__svg: string;
  calendar: string;
  calendar__buttonToday: string;
  calendar__header: string;
  calendar__heading: string;
  calendarGrid: string;
  calendarGrid__cell: string;
  calendarGrid__cell__today: string;
  calendarGrid__header: string;
  calendarGrid__header__cell: string;
  'danger-pulse': string;
  'dark-theme': string;
  dateInput: string;
  datePicker: string;
  dateSegment: string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  group: string;
  icon: string;
  label: string;
  popover: string;
  pulse: string;
  select: string;
  success: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
