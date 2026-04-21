export type Styles = {
  dateInput: string;
  dateSegment: string;
  fieldError: string;
  label: string;
  text: string;
  timeField: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
