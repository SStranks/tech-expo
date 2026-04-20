export type Styles = {
  contactStatus: string;
  'contactStatus--churned': string;
  'contactStatus--contacted': string;
  'contactStatus--interested': string;
  'contactStatus--lost': string;
  'contactStatus--negotiation': string;
  'contactStatus--new': string;
  'contactStatus--qualified': string;
  'contactStatus--unqualified': string;
  'contactStatus--won': string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  icon: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
