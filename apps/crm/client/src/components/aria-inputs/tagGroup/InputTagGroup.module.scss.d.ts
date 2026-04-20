export type Styles = {
  button: string;
  button__svg: string;
  tag: string;
  tagGroup: string;
  tagList: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
