export type Styles = {
  'danger-pulse': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  tableSingleColumn: string;
  tableSingleColumn__header: string;
  tableSingleColumn__row: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
