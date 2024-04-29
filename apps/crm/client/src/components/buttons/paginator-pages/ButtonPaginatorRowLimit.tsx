import type { Updater } from '@tanstack/react-table';
import { Button, Key, Label, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';
import { IconList } from '#Components/svg';
import styles from './_ButtonPaginatorRowLimit.module.scss';

const PAGE_SIZES = [10, 20, 50, 100];

interface IProps {
  setPageSize: (updater: Updater<number>) => void;
}

function ButtonPaginatorRowLimit(props: IProps): JSX.Element {
  const { setPageSize } = props;

  const onSelectionChange = (key: Key) => {
    setPageSize(key as number);
  };

  return (
    <Select onSelectionChange={onSelectionChange} defaultSelectedKey={PAGE_SIZES[0]} className={styles.select}>
      <Label className="invisibleAccessible">Select number of rows visible</Label>
      <Button className={styles.button}>
        <IconList svgClass={styles.button__svg} />
      </Button>
      <SelectValue className={styles.selectValue} />
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
