import type { RowData, TableFeatures } from '@tanstack/react-table';

export type Tables = 'companies' | 'contacts' | 'quotes';
export type TablesGrid = Extract<Tables, 'companies' | 'contacts'>;

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TFeatures extends TableFeatures, TData extends RowData> {
    tableName: 'companies' | 'contacts' | 'quotes' | 'audit' | 'audit-details' | 'settings-contacts';
  }
}
