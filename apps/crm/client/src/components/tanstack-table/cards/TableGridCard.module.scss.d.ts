export type Styles = {
  'danger-pulse': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  inputMenu__test: string;
  tableGridCard: string;
  tableGridCard__upper: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
