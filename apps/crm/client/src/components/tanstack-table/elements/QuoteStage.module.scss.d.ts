export type Styles = {
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  icon: string;
  quoteStage: string;
  'quoteStage--accepted': string;
  'quoteStage--draft': string;
  'quoteStage--sent': string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
