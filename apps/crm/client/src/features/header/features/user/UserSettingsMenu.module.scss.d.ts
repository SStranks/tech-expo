export type Styles = {
  appeaDone: string;
  appear: string;
  'danger-pulse': string;
  'dark-theme': string;
  enter: string;
  enterActive: string;
  enterDone: string;
  exit: string;
  exitActive: string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  logoutBtn: string;
  logoutBtn__svg: string;
  portalContent: string;
  portalContent__buttons: string;
  portalContent__header: string;
  'theme-transition-duration': string;
  userIcon: string;
  userIcon__svg: string;
  userSettingsBtn: string;
  userSettingsBtn__svg: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
