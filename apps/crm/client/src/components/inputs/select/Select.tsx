import { Button, Label, ListBox, ListBoxItem, Popover, Select, SelectValue } from 'react-aria-components';
import IconArrowDownAlt from '#Components/svg/IconArrowDownAlt';
import styles from './_Select.module.scss';

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
      <Label className={styles.label}>{props.label}</Label>
      <Button className={styles.button}>
        <SelectValue className={styles.selectValue} />
        <span aria-hidden="true">
          <IconArrowDownAlt className={styles.button__icon} />
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
