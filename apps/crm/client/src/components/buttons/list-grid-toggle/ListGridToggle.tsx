import type { Atom } from '@tanstack/react-store';
import type { ColumnFiltersState } from '@tanstack/react-table';

import { useSelector } from '@tanstack/react-store';
import { useState } from 'react';
import { Label, Radio, RadioGroup } from 'react-aria-components';

import IconGrid from '@Components/svg/IconGrid';
import IconListDownArrow from '@Components/svg/IconListDownArrow';

import styles from './ListGridToggle.module.scss';

type Props = {
  columnFiltersAtom: Atom<ColumnFiltersState>;
  setTableView: React.Dispatch<React.SetStateAction<'list' | 'grid'>>;
  tableView: 'list' | 'grid';
};

function ListGridToggle(props: Props): React.JSX.Element {
  const { columnFiltersAtom, setTableView, tableView } = props;
  const columnFilters = useSelector(columnFiltersAtom);
  const [columnFiltersInternal, setColumnFiltersInternal] = useState<ColumnFiltersState>(columnFilters);

  const onChangeHandler = (val: string) => {
    if (val === 'list') {
      columnFiltersAtom.set(columnFiltersInternal);
      setTableView('list');
    }
    if (val === 'grid') {
      setColumnFiltersInternal(columnFilters);
      columnFiltersAtom.set([]);
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
