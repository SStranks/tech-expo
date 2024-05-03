import type { ColumnFiltersState } from '@tanstack/react-table';
import ListGridToggle from '#Components/buttons/list-grid-toggle/ListGridToggle';
import { IconAddCircle } from '#Components/svg';
import { GlobalFilterControl } from '../';
import styles from './_TableControlsHeader.module.scss';

interface IProps {
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
    resetColumnFilters: (defaultState?: boolean | undefined) => void;
  };
}

function TableControlsHeader(props: IProps): JSX.Element {
  const { createEntryBtn, globalFilter, listGridToggle } = props;

  return (
    <div className={styles.header}>
      <button type="button" className={styles.header__createContactBtn} onClick={createEntryBtn.onClick}>
        <span>{createEntryBtn.displayText}</span>
        <IconAddCircle svgClass={styles.header__createContactBtn__svg} />
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
