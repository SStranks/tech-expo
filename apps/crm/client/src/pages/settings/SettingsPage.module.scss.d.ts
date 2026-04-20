export type Styles = {
  companyInfo: string;
  companyInfo__icon: string;
  settingsPage: string;
  table: string;
  tableContainer: string;
  tbody: string;
  tbody__tr: string;
  td: string;
  th: string;
  thead: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
