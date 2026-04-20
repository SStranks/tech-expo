export type Styles = {
  aside: string;
  aside__list: string;
  aside__menuButton: string;
  aside__menuButton__mask: string;
  'aside--minimize': string;
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
