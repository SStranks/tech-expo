export type Styles = {
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  formContainer: string;
  pulse: string;
  registerForm: string;
  registerForm__loginLink: string;
  registerForm__submitBtn: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
