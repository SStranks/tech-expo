export type Styles = {
  addEntryBtn: string;
  addEntryBtn__svg: string;
  cancelBtn: string;
  closeBtn: string;
  closeBtn__svg: string;
  'danger-pulse': string;
  'dark-theme': string;
  deleteBtn: string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  okayBtn: string;
  optionsBtn: string;
  optionsBtn__menu: string;
  optionsBtn__popover: string;
  optionsBtn__svg: string;
  pulse: string;
  saveBtn: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
