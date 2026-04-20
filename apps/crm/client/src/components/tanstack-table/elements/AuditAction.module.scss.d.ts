export type Styles = {
  auditAction: string;
  'auditAction--create': string;
  'auditAction--delete': string;
  'auditAction--update': string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
