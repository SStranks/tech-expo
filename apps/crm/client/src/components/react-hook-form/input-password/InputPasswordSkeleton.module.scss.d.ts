export type Styles = {
  container: string;
  loading: string;
  result: string;
  wrapper: string;
  wrapper__icons: string;
  wrapper__input: string;
  wrapper__label: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
