export type Styles = {
  company: string;
  company__img: string;
  contactsCardLower: string;
  contactsCardLower__role: string;
  'danger-pulse': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
