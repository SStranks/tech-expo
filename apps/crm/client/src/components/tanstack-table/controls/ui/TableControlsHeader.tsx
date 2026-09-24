import type { Atom } from '@tanstack/react-store';
import type { ColumnFiltersState } from '@tanstack/react-table';

import ListGridToggle from '@Components/buttons/list-grid-toggle/ListGridToggle';
import IconCirclePlus from '@Components/svg/IconCirclePlus';

import GlobalFilterControl from '../global-filter/GlobalFilterControl';

import styles from './TableControlsHeader.module.scss';

type Props = {
  columnFiltersAtom: Atom<ColumnFiltersState>;
  createEntryBtn: {
    displayText: string;
    onClick: () => void;
  };
  globalFilterAtom: Atom<string>;
  tableName: string | undefined;
  tableView?: {
    setTableView: React.Dispatch<React.SetStateAction<'list' | 'grid'>>;
    tableView: 'list' | 'grid';
  };
};

function TableControlsHeader(props: Props): React.JSX.Element {
  const { createEntryBtn, columnFiltersAtom, globalFilterAtom, tableName, tableView } = props;

  return (
    <div className={styles.header}>
      <button type="button" className={styles.header__createContactBtn} onClick={createEntryBtn.onClick}>
        <span>{createEntryBtn.displayText}</span>
        <IconCirclePlus svgClass={styles.header__createContactBtn__svg} />
      </button>
      <div className={styles.header__controls}>
        <GlobalFilterControl
          globalFilterAtom={globalFilterAtom}
          debounceDelay={250}
          label={`Search ${tableName || 'table'}`}
        />
        {tableView && (
          <ListGridToggle
            columnFiltersAtom={columnFiltersAtom}
            tableView={tableView.tableView}
            setTableView={tableView.setTableView}
          />
        )}
      </div>
    </div>
  );
}

export default TableControlsHeader;
