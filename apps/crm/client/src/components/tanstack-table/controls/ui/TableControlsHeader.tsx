import type { ColumnFiltersState } from '@tanstack/react-table';

import ListGridToggle from '@Components/buttons/list-grid-toggle/ListGridToggle';
import IconCirclePlus from '@Components/svg/IconCirclePlus';

import GlobalFilterControl from '../global-filter/GlobalFilterControl';

import styles from './TableControlsHeader.module.scss';

type Props = {
  createEntryBtn: {
    displayText: string;
    onClick: () => void;
  };
  globalFilter: {
    globalFilter: string;
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
    tableName: string | undefined;
  };
  listGridToggle?: {
    tableView: 'list' | 'grid';
    setTableView: React.Dispatch<React.SetStateAction<'list' | 'grid'>>;
    columnFilters: ColumnFiltersState;
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    resetColumnFilters: (defaultState?: boolean) => void;
  };
};

function TableControlsHeader(props: Props): React.JSX.Element {
  const { createEntryBtn, globalFilter, listGridToggle } = props;

  return (
    <div className={styles.header}>
      <button type="button" className={styles.header__createContactBtn} onClick={createEntryBtn.onClick}>
        <span>{createEntryBtn.displayText}</span>
        <IconCirclePlus svgClass={styles.header__createContactBtn__svg} />
      </button>
      <div className={styles.header__controls}>
        <GlobalFilterControl
          globalFilter={globalFilter.globalFilter}
          setGlobalFilter={globalFilter.setGlobalFilter}
          debounceDelay={250}
          label={`Search ${globalFilter.tableName || 'table'}`}
        />
        {listGridToggle && (
          <ListGridToggle
            tableView={listGridToggle.tableView}
            setTableView={listGridToggle.setTableView}
            columnFilters={listGridToggle.columnFilters}
            setColumnFilters={listGridToggle.setColumnFilters}
            resetColumnFilters={listGridToggle.resetColumnFilters}
          />
        )}
      </div>
    </div>
  );
}

export default TableControlsHeader;
