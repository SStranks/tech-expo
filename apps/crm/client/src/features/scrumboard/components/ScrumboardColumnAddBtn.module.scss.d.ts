export type Styles = {
  addCardBtn: string;
  addCardBtn__svg: string;
  'addCardBtn--lost': string;
  'addCardBtn--won': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
