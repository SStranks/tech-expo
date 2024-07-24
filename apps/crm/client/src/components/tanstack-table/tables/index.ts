import { RowData } from '@tanstack/react-table';

export { default as TableAuditLog } from './audit-log/TableAuditLog';
export { default as TableAuditLogDetails } from './audit-log/TableAuditLogDetails';
export { default as TableCompanies } from './companies/TableCompanies';
export { default as TableCompaniesDelete } from './companies/TableCompaniesDelete';
export { default as TableContacts } from './contacts/TableContacts';
export { default as TableContactsDelete } from './contacts/TableContactsDelete';
export { default as TableQuotes } from './quotes/TableQuotes';
export { default as TableQuotesDelete } from './quotes/TableQuotesDelete';
export { default as TableSettingsContacts } from './settings/TableSettingsContacts';

export type TTables = 'companies' | 'contacts' | 'quotes';
export type TTablesGrid = Extract<TTables, 'companies' | 'contacts'>;

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    tableName: 'companies' | 'contacts' | 'quotes' | 'audit' | 'audit-details' | 'settings-contacts';
  }
}
