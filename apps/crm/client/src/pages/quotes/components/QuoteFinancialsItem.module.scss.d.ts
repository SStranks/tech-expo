export type Styles = {
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  inputTemp: string;
  quoteFinancialsItem: string;
  quoteFinancialsItem__deleteBtn: string;
  quoteFinancialsItem__deleteBtn__svg: string;
  quoteFinancialsItem__gridItem: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
