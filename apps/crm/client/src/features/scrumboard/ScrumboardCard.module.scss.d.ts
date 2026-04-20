export type Styles = {
  card: string;
  card__lower: string;
  card__lower__details: string;
  card__lower__total: string;
  card__upper: string;
  'card--dragEnter': string;
  'card--dragging': string;
  'card--focus': string;
  'card--lost': string;
  'card--won': string;
  companyLogo: string;
  'danger-pulse': string;
  dangerCard: string;
  dealInfo: string;
  dealInfo__company: string;
  dealInfo__title: string;
  dealInfo__upper: string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
