export type Styles = {
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  inputGroup: string;
  inputGroup__cancelBtn: string;
  inputGroup__input: string;
  inputGroup__saveBtn: string;
  item: string;
  item__description: string;
  item__edit: string;
  item__edit__svg: string;
  item__svg: string;
  item__title: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
