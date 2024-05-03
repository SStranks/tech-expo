import type { ColumnFiltersState, Table } from '@tanstack/react-table';
import ListGridToggle from '#Components/buttons/list-grid-toggle/ListGridToggle';
import { IconAddCircle } from '#Components/svg';
import { GlobalFilterControl } from '../';
import styles from './_TableControlsHeader.module.scss';

const createContactClickHandler = () => {
  console.log('Click');
};

interface IProps<T> {
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  listGridToggle?: {
    tableView: 'list' | 'grid';
    setTableView: React.Dispatch<React.SetStateAction<'list' | 'grid'>>;
    columnFilters: ColumnFiltersState;
    table: Table<T>;
  };
}

function TableControlsHeader<T>(props: IProps<T>): JSX.Element {
  const { globalFilter, setGlobalFilter, listGridToggle } = props;

  return (
    <div className={styles.header}>
      <button type="button" className={styles.header__createContactBtn} onClick={createContactClickHandler}>
        <span>Create Contact</span>
        <IconAddCircle svgClass={styles.header__createContactBtn__svg} />
      </button>
      <div className={styles.header__controls}>
        <GlobalFilterControl
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          debounceDelay={250}
          label="Search contacts by name, email, company, or title"
        />
        {listGridToggle && (
          <ListGridToggle
            tableView={listGridToggle.tableView}
            setTableView={listGridToggle.setTableView}
            columnFilters={listGridToggle.columnFilters}
            setColumnFilters={listGridToggle.table.setColumnFilters}
            resetColumnFilters={listGridToggle.table.resetColumnFilters}
          />
        )}
      </div>
    </div>
  );
}

export default TableControlsHeader;
