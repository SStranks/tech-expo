export type Styles = {
  button: string;
  button__active: string;
  button__number: string;
  svg: string;
  svg__active: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
