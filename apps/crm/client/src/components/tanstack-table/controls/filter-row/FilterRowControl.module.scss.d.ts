export type Styles = {
  clearBtn: string;
  'danger-pulse': string;
  'dark-theme': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
  filterBtn: string;
  filterBtn__svg: string;
  input: string;
  popover: string;
  popover__controls: string;
  searchField: string;
  svg: string;
  svg__active: string;
  'theme-transition-duration': string;
  triggerBtn: string;
  triggerBtn__active: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
