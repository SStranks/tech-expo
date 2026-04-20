export type Styles = {
  button: string;
  button__svg: string;
  combo: string;
  comboValue: string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  input: string;
  inputContainer: string;
  inputContainer__button__svg: string;
  inputsGroup: string;
  listBox: string;
  listItem: string;
  popover: string;
  pulse: string;
  'slide-in': string;
  success: string;
  tag: string;
  tagGroup: string;
  tagList: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
