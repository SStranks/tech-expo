import type { ColumnFiltersState, Updater } from '@tanstack/react-table';

import { useState } from 'react';
import { Label, Radio, RadioGroup } from 'react-aria-components';

import { IconGrid, IconListDownArrow } from '@Components/svg';

import styles from './ListGridToggle.module.scss';

interface IProps {
  tableView: 'list' | 'grid';
  setTableView: React.Dispatch<React.SetStateAction<'list' | 'grid'>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
  resetColumnFilters: (defaultState?: boolean | undefined) => void;
}

function ListGridToggle(props: IProps): JSX.Element {
  const { columnFilters, resetColumnFilters, setColumnFilters, setTableView, tableView } = props;
  const [columnFiltersInternal, setColumnFiltersInternal] = useState<ColumnFiltersState>(columnFilters);

  const onChangeHandler = (val: string) => {
    if (val === 'list') {
      setColumnFilters(columnFiltersInternal);
      setTableView('list');
    }
    if (val === 'grid') {
      setColumnFiltersInternal(columnFilters);
      resetColumnFilters();
      setTableView('grid');
    }
  };

  return (
    <RadioGroup onChange={onChangeHandler} defaultValue={tableView} className={styles.radioGroup}>
      <Label></Label>
      <Radio value="list" className={styles.radio}>
        <IconListDownArrow svgClass={styles.radio__svg} />
      </Radio>
      <Radio value="grid" className={styles.radio}>
        <IconGrid svgClass={styles.radio__svg} />
      </Radio>
    </RadioGroup>
  );
}

export default ListGridToggle;
