export type Styles = {
  appeaDone: string;
  appear: string;
  'arrow-bottom': string;
  'arrow-left': string;
  'arrow-right': string;
  'arrow-top': string;
  enter: string;
  enterActive: string;
  enterDone: string;
  exit: string;
  exitActive: string;
  tooltip: string;
  tooltip__text: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
