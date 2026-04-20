export type Styles = {
  addEntryBtn: string;
  header: string;
  header__contacts: string;
  header__svg: string;
  header__title: string;
  header__total: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
