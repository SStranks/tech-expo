import { useState } from 'react';
import { Button, ComboBox, Input, ListBox, ListBoxItem, Popover } from 'react-aria-components';
import IconArrowDownAlt from '#Components/svg/IconArrowDownAlt';
import styles from './_InputCombo.module.scss';

interface IProps {
  value: string | undefined;
  onChange: (...event: unknown[]) => void;
  items: { name: string }[];
  label: string;
  defaultValue: string;
}

function InputCombo({ ...props }: IProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>(props.defaultValue);

  return (
    <ComboBox
      selectedKey={props.value}
      onInputChange={(val) => setInputValue(val)}
      onSelectionChange={props.onChange}
      validationBehavior="aria"
      className={styles.combo}
      {...props}>
      <div className={styles.inputContainer}>
        <Input value={inputValue} className={styles.inputContainer__input} />
        <Button className={styles.inputContainer__button}>
          <IconArrowDownAlt className={styles.inputContainer__button__icon} />
        </Button>
      </div>
      <Popover className={styles.popover}>
        <ListBox items={props.items} className={styles.listBox}>
          {(item) => (
            <ListBoxItem id={item.name} className={styles.listItem}>
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}

export default InputCombo;
