export type Styles = {
  button: string;
  button__svg: string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  listBox: string;
  listItem: string;
  popover: string;
  pulse: string;
  select: string;
  selectValue: string;
  'slide-in': string;
  success: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
