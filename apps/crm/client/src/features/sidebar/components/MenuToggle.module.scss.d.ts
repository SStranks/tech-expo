export type Styles = {
  container: string;
  container__button: string;
  container__svg: string;
  'container__svg--reverse': string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
