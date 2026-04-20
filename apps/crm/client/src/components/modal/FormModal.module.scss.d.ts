export type Styles = {
  appeaDone: string;
  appear: string;
  content: string;
  'danger-pulse': string;
  'dark-theme': string;
  enter: string;
  enterActive: string;
  enterDone: string;
  exit: string;
  exitActive: string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  footer: string;
  formModal: string;
  header: string;
  modalContainer: string;
  pulse: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
