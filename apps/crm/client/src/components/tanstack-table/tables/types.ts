import type { RowData } from '@tanstack/react-table';

export type TTables = 'companies' | 'contacts' | 'quotes';
export type TTablesGrid = Extract<TTables, 'companies' | 'contacts'>;

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    tableName: 'companies' | 'contacts' | 'quotes' | 'audit' | 'audit-details' | 'settings-contacts';
  }
}
