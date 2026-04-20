export type Styles = {
  buttonDecrement: string;
  buttonDecrement__svg: string;
  buttonIncrement: string;
  buttonIncrement__svg: string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  group: string;
  input: string;
  label: string;
  numberField: string;
  pulse: string;
  select: string;
  success: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
