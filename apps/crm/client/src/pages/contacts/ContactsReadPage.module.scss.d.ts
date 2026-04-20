export type Styles = {
  contactsReadPage__header: string;
  contactsReadPage__tables: string;
  lifecycleTable: string;
  notesTable: string;
  userDetails: string;
  userDetails__name: string;
  userDetails__title: string;
  userProfileImage: string;
  userTable: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
