export type Styles = {
  addCardBtn: string;
  cardsTotal: string;
  'cardsTotal--lost': string;
  'cardsTotal--won': string;
  column: string;
  column__cards: string;
  column__header: string;
  'column__header--lost': string;
  'column__header--won': string;
  'column--dragEnter': string;
  'column--lost': string;
  'column--won': string;
  'danger-pulse': string;
  dangerColumn: string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  headerControls: string;
  headerDetails: string;
  'headerDetails__title--lost': string;
  'headerDetails__title--won': string;
  headerPanel: string;
  pipelineTotal: string;
  'pipelineTotal--lost': string;
  'pipelineTotal--won': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
