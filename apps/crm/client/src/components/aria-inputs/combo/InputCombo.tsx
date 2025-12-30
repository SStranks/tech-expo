import { Button, ComboBox, Input, ListBox, ListBoxItem, Popover } from 'react-aria-components';

import IconArrowDownAlt from '@Components/svg/IconArrowDownAlt';

import styles from './InputCombo.module.scss';

interface Props {
  value: string | undefined;
  onChange: (...event: unknown[]) => void;
  items: { name: string }[];
  label: string;
  defaultValue: string;
  id: string;
}

function InputCombo(props: Props): React.JSX.Element {
  const { id, items, onChange, value, ...rest } = props;

  return (
    <ComboBox
      defaultItems={items}
      selectedKey={value}
      onSelectionChange={onChange}
      validationBehavior="aria"
      aria-labelledby={id}
      className={styles.combo}
      {...rest}>
      <div className={styles.inputContainer}>
        <Input className={styles.inputContainer__input} />
        <Button className={styles.inputContainer__button}>
          <IconArrowDownAlt svgClass={styles.inputContainer__button__svg} />
        </Button>
      </div>
      <Popover className={styles.popover}>
        <ListBox className={styles.listBox}>
          {(item: { name: string }) => (
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
