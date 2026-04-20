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
  notificationIcon: string;
  notificationIcon__indicator: string;
  'notificationIcon__indicator--noMessages': string;
  'notificationIcon__indicator--readMessages': string;
  'notificationIcon__indicator--unreadMessages': string;
  notificationIcon__svg: string;
  notifications: string;
  notifications__clear: string;
  notifications__clear__clearBtn: string;
  notifications__header: string;
  notifications__list: string;
  portalContent: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
