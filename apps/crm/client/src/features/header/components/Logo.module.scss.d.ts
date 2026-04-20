export type Styles = {
  logo: string;
  logo__img: string;
  logo__title: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
