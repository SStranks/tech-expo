import { Button, ComboBox, Input, ListBox, ListBoxItem, Popover } from 'react-aria-components';
import IconArrowDownAlt from '#Components/svg/IconArrowDownAlt';
import styles from './_InputCombo.module.scss';

interface IProps {
  value: string | undefined;
  onChange: (...event: unknown[]) => void;
  items: { name: string }[];
  label: string;
  defaultValue: string;
  id: string;
}

function InputCombo(props: IProps): JSX.Element {
  const { items, value, onChange, id, ...rest } = props;

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
