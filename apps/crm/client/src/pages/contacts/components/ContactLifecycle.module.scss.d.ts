export type Styles = {
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  header: string;
  header__svg: string;
  header__title: string;
  'theme-transition-duration': string;
  tracker: string;
  tracker__container: string;
  tracker__pill: string;
  tracker__stage: string;
  tracker__svg: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
