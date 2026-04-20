export type Styles = {
  details: string;
  details__category: string;
  details__description: string;
  details__title: string;
  searchResult: string;
  searchResult__svg: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
