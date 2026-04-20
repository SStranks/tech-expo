export type Styles = {
  backQuotesPage: string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  hr: string;
  quoteDocument: string;
  quoteDocument__body: string;
  quoteDocument__body__financials: string;
  quoteDocument__body__financials__grid: string;
  quoteDocument__body__table: string;
  quoteDocument__body__titleBlock: string;
  quoteDocument__body__titleBlock__title: string;
  quoteDocument__footer: string;
  quoteDocument__header: string;
  quoteDocument__header__companyLogo: string;
  quoteDocument__header__companyTitle: string;
  quoteDocument__header__details: string;
  quoteDocument__header__participants: string;
  quoteDocument__header__prepared: string;
  quoteDocument__header__preparedParticipant: string;
  quoteReadPage: string;
  summary: string;
  summary__quoteTitle: string;
  summaryBtns: string;
  summaryBtns__convertPDF: string;
  summaryBtns__convertPDF__svg: string;
  summaryBtns__editQuote: string;
  summaryBtns__editQuote__svg: string;
  'theme-transition-duration': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
