export type Styles = {
  button: string;
  'icon--primary': string;
  'icon--quaternary': string;
  'icon--secondary': string;
  iconOnly: string;
  'shape--circle': string;
  'shape--default': string;
  'shape--pill': string;
  'size--default': string;
  'size--large': string;
  'size--small': string;
  'type--primary': string;
  'type--quaternary': string;
  'type--secondary': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
