export type Styles = {
  container: string;
  'Storybook-ThemeToggle': string;
  widgets: string;
  widgets__widget: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
