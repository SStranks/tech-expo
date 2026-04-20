export type Styles = {
  'danger-pulse': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  menuLink: string;
  menuLink__activeRoute: string;
  menuLink__iconContainer: string;
  menuLink__svg: string;
  menuLink__text: string;
  'menuLink--maximize': string;
  'menuLink--minimize': string;
  'translate-icon-maximize': string;
  'translate-icon-minimize': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
