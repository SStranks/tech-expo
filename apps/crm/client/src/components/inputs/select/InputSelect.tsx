import { Button, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';
import IconArrowDownAlt from '#Components/svg/IconArrowDownAlt';
import styles from './_InputSelect.module.scss';

interface IProps {
  name: string;
  value: string | undefined;
  items: { name: string }[];
  label: string;
  onChange: (...event: unknown[]) => void;
}

function InputSelect({ ...props }: IProps): JSX.Element {
  return (
    <Select
      onSelectionChange={props.onChange}
      selectedKey={props.value}
      placeholder=""
      validationBehavior="aria"
      className={styles.select}
      {...props}>
      <Button className={styles.button}>
        <SelectValue className={styles.selectValue} />
        <span aria-hidden="true">
          <IconArrowDownAlt svgClass={styles.button__svg} />
        </span>
      </Button>
      <Popover className={styles.popover}>
        <ListBox className={styles.listBox} items={props.items}>
          {(item) => (
            <ListBoxItem id={item.name} className={styles.listItem}>
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
}

export default InputSelect;
