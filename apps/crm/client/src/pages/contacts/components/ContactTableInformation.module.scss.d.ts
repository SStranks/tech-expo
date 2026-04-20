export type Styles = {
  header: string;
  header__headerSvg: string;
  header__headerTitle: string;
  row: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
