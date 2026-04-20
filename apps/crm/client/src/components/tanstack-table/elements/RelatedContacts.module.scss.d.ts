export type Styles = {
  displayImage: string;
  extraUsers: string;
  relatedContacts: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
