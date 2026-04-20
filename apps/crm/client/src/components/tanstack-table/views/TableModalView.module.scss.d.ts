export type Styles = {
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  table: string;
  tableContainer: string;
  tbody: string;
  tbody__tr: string;
  td: string;
  th: string;
  th__container: string;
  th__container__controls: string;
  thead: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
