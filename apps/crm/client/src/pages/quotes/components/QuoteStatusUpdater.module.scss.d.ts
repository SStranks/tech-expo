export type Styles = {
  accepted: string;
  draft: string;
  quoteStatusUpdater: string;
  quoteStatusUpdater__accepted: string;
  quoteStatusUpdater__draft: string;
  quoteStatusUpdater__sent: string;
  sent: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
