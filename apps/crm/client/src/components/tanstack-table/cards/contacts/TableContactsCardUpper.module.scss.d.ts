export type Styles = {
  contactsCardUpper: string;
  contactsCardUpper__email: string;
  contactsCardUpper__img: string;
  contactsCardUpper__name: string;
  contactsCardUpper__optionsBtn: string;
  'danger-pulse': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
