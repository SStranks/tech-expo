export type Styles = {
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  searchControl: string;
  searchControl__logoSvg: string;
  searchControl__searchKey: string;
  searchControl__searchSpan: string;
  searchControls: string;
  searchForm: string;
  searchForm__closeBtn: string;
  searchForm__closeBtn__svg: string;
  searchForm__input: string;
  searchForm__svg: string;
  searchModal: string;
  searchResults: string;
  searchResults__title: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
