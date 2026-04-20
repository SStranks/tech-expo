export type Styles = {
  cardOptionsBtn: string;
  cardOptionsBtn__menu: string;
  cardOptionsBtn__menuItem: string;
  cardOptionsBtn__menuItem__svg: string;
  cardOptionsBtn__menuItemWarning: string;
  cardOptionsBtn__menuItemWarning__svg: string;
  cardOptionsBtn__popover: string;
  cardOptionsBtn__separator: string;
  cardOptionsBtn__svg: string;
  'cardOptionsBtn--lost': string;
  'cardOptionsBtn--won': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
