import type { Updater } from '@tanstack/react-table';
import type { Key } from 'react-aria-components';

import { Button, Label, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';

import IconListDownArrow from '@Components/svg/IconListDownArrow';

import styles from './ButtonPaginatorRowLimit.module.scss';

// NOTE:  Without manually using context; <SelectValue /> needs to sit inside <Button /> or <Label />
// function SelectValueWrapper(): React.JSX.Element {
//   return <SelectValue>{({ selectedText }) => <span className={styles.selectValue}>{selectedText}</span>}</SelectValue>;
// }

const PAGE_SIZES = [10, 20, 50, 100];

type Props = {
  setPageSize: (updater: Updater<number>) => void;
};

function ButtonPaginatorRowLimit(props: Props): React.JSX.Element {
  const { setPageSize } = props;

  const onSelectionChange = (key: Key | null) => {
    setPageSize(key as number);
  };

  return (
    <Select onChange={onSelectionChange} defaultValue={PAGE_SIZES[0]} className={styles.select}>
      <Label className="invisibleAccessible">Select number of rows visible</Label>
      <Button className={styles.button}>
        <IconListDownArrow svgClass={styles.button__svg} />
      </Button>
      <SelectValue>{({ selectedText }) => <span className={styles.selectValue}>{selectedText}</span>}</SelectValue>
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
