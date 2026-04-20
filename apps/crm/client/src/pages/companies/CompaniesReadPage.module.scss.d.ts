export type Styles = {
  companiesReadPage__header: string;
  companiesReadPage__tables: string;
  companyDetails: string;
  companyDetails__name: string;
  companyDetails__salesOwner: string;
  companyLogo: string;
  companyTable: string;
  contactsTable: string;
  dealsTable: string;
  notesTable: string;
  quotesTable: string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
