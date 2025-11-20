import type { RowData, TableOptions } from '@tanstack/react-table';

import { useReactTable as TanstackReactTable } from '@tanstack/react-table';

/*
  NOTE:
  Wrapper: Tanstack React-Table v8 has incompatibility with React 19 compiler. Extracted to avoid multipe linting
  errors across multiple files.
  https://github.com/TanStack/table/issues/5567
  https://github.com/facebook/react/issues/33057
  "Compilation Skipped: Use of incompatible library" warning message
*/
export function useReactTable<TData extends RowData>(options: TableOptions<TData>) {
  return TanstackReactTable(options);
}
