export type Styles = {
  'Storybook-ThemeToggle': string;
  container: string;
  widgets: string;
  widgets__widget: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
