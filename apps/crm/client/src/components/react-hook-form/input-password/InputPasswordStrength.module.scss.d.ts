export type Styles = {
  container: string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  icons: string;
  icons__btn: string;
  icons__btn__svg: string;
  infoPanel: string;
  infoPanel__active: string;
  infoPanel__content: string;
  infoPanel__content__body: string;
  infoPanel__content__link: string;
  infoPanel__content__title: string;
  infoPanel__inner: string;
  inputPassword: string;
  pulse: string;
  result: string;
  result__meter: string;
  'result__meter--0': string;
  'result__meter--1': string;
  'result__meter--2': string;
  'result__meter--3': string;
  'result__meter--4': string;
  success: string;
  'theme-transition-duration': string;
  wrapper__input: string;
  wrapper__label: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
