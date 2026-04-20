export type Styles = {
  appeaDone: string;
  appear: string;
  'danger-pulse': string;
  details: string;
  enter: string;
  enterActive: string;
  enterDone: string;
  exit: string;
  exitActive: string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  portalContent: string;
  titleBar: string;
  titleBar__closeBtn: string;
  titleBar__closeBtn__svg: string;
  userProfile: string;
  userSettingsModal: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
