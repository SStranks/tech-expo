export type Styles = {
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  formContainer: string;
  pulse: string;
  'theme-transition-duration': string;
  updatePasswordForm: string;
  updatePasswordForm__link: string;
  updatePasswordForm__submitBtn: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
