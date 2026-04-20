export type Styles = {
  button: string;
  button__svg: string;
  listItem: string;
  popover: string;
  select: string;
  selectValue: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
