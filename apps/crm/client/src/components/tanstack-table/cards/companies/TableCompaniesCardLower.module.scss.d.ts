export type Styles = {
  companiesCardLower: string;
  companiesCardLower__relatedContacts: string;
  companiesCardLower__relatedContactsImgs: string;
  companiesCardLower__salesOwner: string;
  companiesCardLower__salesOwnerImg: string;
  'danger-pulse': string;
  fadein: string;
  fadeout: string;
  'fallback-fade-in': string;
  'fallback-fade-out': string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
