export type Styles = {
  combo: string;
  comboValue: string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  inputContainer: string;
  inputContainer__button: string;
  inputContainer__button__svg: string;
  inputContainer__input: string;
  listBox: string;
  listItem: string;
  popover: string;
  pulse: string;
  'slide-in': string;
  success: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
