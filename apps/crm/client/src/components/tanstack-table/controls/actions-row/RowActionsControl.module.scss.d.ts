export type Styles = {
  link: string;
  linkDelete: string;
  rowActions: string;
  svg: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
