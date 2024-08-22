import {
  Button,
  ComboBox,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
  TagGroup,
  TagList,
  Tag,
  Key,
  Group,
} from 'react-aria-components';
import { FieldValues, UseFormTrigger } from 'react-hook-form';
import { IconClose, IconArrowDownAlt } from '#Components/svg';
import styles from './_InputComboTag.module.scss';
import { useState } from 'react';

interface IListItem {
  id: number;
  name: string;
}

interface IProps {
  name: string;
  onChange: (...event: unknown[]) => void;
  listItems: IListItem[];
  label: string;
  defaultValue: string;
  id: string;
  trigger: UseFormTrigger<FieldValues>;
}

// NOTE:  Can't style multiple selection in ListBox when child of Combo; dynamic classes don't work within the component.
// NOTE:  May have to break apart implemention and utilize hooks, or place ListBox outside combo and hook up.
function InputComboTag(props: IProps): JSX.Element {
  const { name, listItems, onChange, id, trigger, ...rest } = props;
  const [selectedKeys, setSelectedKeys] = useState<IListItem[]>([]);
  const [inputValue, setInputValue] = useState('');

  const onSelect = (key: Key | null) => {
    if (selectedKeys.some((p) => p.id === key)) {
      setSelectedKeys((prev) => prev.filter((p) => p.id !== key));
    } else {
      const selected = listItems.find((p) => p.id === key);
      if (selected) {
        setSelectedKeys((prev) => [...prev, selected]);
      }
    }
    setInputValue('');
  };

  const onRemove = (ids: Set<Key>) => {
    setSelectedKeys((prev) => prev.filter((p) => !ids.has(p.id)));
    // const newList = value.filter((p) => !ids.has(p.id));
    onChange(selectedKeys);
    trigger(name);
  };

  return (
    <ComboBox
      defaultItems={listItems}
      inputValue={inputValue}
      onInputChange={setInputValue}
      selectedKey={null}
      onSelectionChange={onSelect}
      aria-labelledby={id}
      className={styles.combo}
      {...rest}>
      <Group className={styles.inputContainer}>
        <Group className={styles.inputsGroup}>
          <TagGroup onRemove={onRemove} aria-labelledby={id} className={styles.tagGroup} {...rest}>
            <TagList items={selectedKeys} className={styles.tagList}>
              {(item: { id: number; name: string }) => (
                <Tag textValue={item.name} id={item.id} className={styles.tag}>
                  {item.name}
                  <Button slot="remove" className={styles.button}>
                    <IconClose svgClass={styles.button__svg} />
                  </Button>
                </Tag>
              )}
            </TagList>
            <Input className={styles.input} />
          </TagGroup>
        </Group>
        <Button className={styles.inputContainer__button}>
          <IconArrowDownAlt svgClass={styles.inputContainer__button__svg} />
        </Button>
      </Group>
      <Popover className={styles.popover}>
        <ListBox className={styles.listBox}>
          {(item: { id: number; name: string }) => (
            <ListBoxItem id={item.id} className={styles.listItem}>
              {item.name}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </ComboBox>
  );
}

export default InputComboTag;
