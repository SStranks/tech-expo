export type Styles = {
  button: string;
  button__svg: string;
  'danger-pulse': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  iconSearch: string;
  input: string;
  searchField: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
