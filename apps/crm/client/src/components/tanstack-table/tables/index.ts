export { default as TableAuditLog } from './audit-log/TableAuditLog';
export { default as TableAuditLogDetails } from './audit-log/TableAuditLogDetails';
export { default as TableCompanies } from './companies/TableCompanies';
export { default as TableContacts } from './contacts/TableContacts';
export { default as TableQuotes } from './quotes/TableQuotes';

export type TTables = 'companies' | 'contacts' | 'quotes';
export type TTablesGrid = Extract<TTables, 'companies' | 'contacts'>;
