import { IconList } from '#Components/svg';
import { Button, Label, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';
import styles from './_ButtonPaginatorRowLimit.module.scss';

function ButtonPaginatorRowLimit(): JSX.Element {
  return (
    <Select defaultSelectedKey={0} className={styles.select}>
      <Label className="invisibleAccessible">Select number of rows visible</Label>
      <Button className={styles.button}>
        <IconList svgClass={styles.button__svg} />
      </Button>
      <SelectValue className={styles.selectValue} />
      <Popover className={styles.popover}>
        <ListBox>
          <ListBoxItem id={0} className={styles.listItem}>
            10
          </ListBoxItem>
          <ListBoxItem className={styles.listItem}>20</ListBoxItem>
          <ListBoxItem className={styles.listItem}>50</ListBoxItem>
          <ListBoxItem className={styles.listItem}>100</ListBoxItem>
        </ListBox>
      </Popover>
    </Select>
  );
}

export default ButtonPaginatorRowLimit;
