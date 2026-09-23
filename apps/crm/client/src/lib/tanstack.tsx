import type { RowData, TableFeatures, TableOptions } from '@tanstack/react-table';

import { useTable as TanstackReactTable } from '@tanstack/react-table';

/*
  NOTE:
  Wrapper: Tanstack React-Table v8 has incompatibility with React 19 compiler. Extracted to avoid multipe linting
  errors across multiple files.
  https://github.com/TanStack/table/issues/5567
  https://github.com/facebook/react/issues/33057
  "Compilation Skipped: Use of incompatible library" warning message
*/
export function useReactTable<TData extends RowData, TFeatures extends TableFeatures>(
  options: TableOptions<TFeatures, TData>
) {
  return TanstackReactTable(options);
}
