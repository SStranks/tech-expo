export type Styles = {
  noNewNotifications: string;
  notification: string;
  notification__description: string;
  notification__details: string;
  notification__identity: string;
  notification__img: string;
  notification__timeframe: string;
  notificationsList: string;
  notificationsList__ul: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
