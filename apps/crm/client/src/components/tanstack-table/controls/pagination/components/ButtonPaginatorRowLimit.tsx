import type { Updater } from '@tanstack/react-table';

import { useContext } from 'react';
import { Button, Key, Label, ListBox, ListBoxItem, Popover, Select, SelectStateContext } from 'react-aria-components';

import IconListDownArrow from '@Components/svg/IconListDownArrow';

import styles from './ButtonPaginatorRowLimit.module.scss';

// NOTE:  Without manually using context; <SelectValue /> needs to sit inside <Button /> or <Label />
function SelectValueWrapper(): React.JSX.Element {
  const selectValue = useContext(SelectStateContext);
  const value = selectValue?.selectedItem?.textValue;
  return <span className={styles.selectValue}>{value}</span>;
}

const PAGE_SIZES = [10, 20, 50, 100];

interface Props {
  setPageSize: (updater: Updater<number>) => void;
}

function ButtonPaginatorRowLimit(props: Props): React.JSX.Element {
  const { setPageSize } = props;

  const onSelectionChange = (key: Key | null) => {
    setPageSize(key as number);
  };

  return (
    <Select onSelectionChange={onSelectionChange} defaultSelectedKey={PAGE_SIZES[0]} className={styles.select}>
      <Label className="invisibleAccessible">Select number of rows visible</Label>
      <Button className={styles.button}>
        <IconListDownArrow svgClass={styles.button__svg} />
      </Button>
      <SelectValueWrapper />
      <Popover className={styles.popover}>
        <ListBox>
          {PAGE_SIZES.map((number: number) => (
            <ListBoxItem key={number} id={number} className={styles.listItem} textValue={number.toString()}>
              {number}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  );
}

export default ButtonPaginatorRowLimit;
