export type Styles = {
  companyDetails: string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  header: string;
  searchBar: string;
  settingsBar: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
