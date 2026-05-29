export type Styles = {
  storybook_background_dark: string;
  storybook_background_light: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
