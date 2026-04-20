export type Styles = {
  appeaDone: string;
  appear: string;
  'danger-pulse': string;
  enter: string;
  enterActive: string;
  enterDone: string;
  exit: string;
  exitActive: string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  portalContent: string;
  searchBar: string;
  searchBar__shortcutKey: string;
  searchBar__svg: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
