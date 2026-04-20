export type Styles = {
  'danger-pulse': string;
  'dark-theme': string;
  error: string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  inputUX: string;
  inputUX__errorMessage: string;
  inputUX__label: string;
  inputUX__required: string;
  pulse: string;
  'react-area-Input': string;
  success: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
