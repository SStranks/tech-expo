export type Styles = {
  sortRowControlBtn: string;
  sortRowControlBtn__active: string;
  svg: string;
  svg__ascending: string;
  svg__descending: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
