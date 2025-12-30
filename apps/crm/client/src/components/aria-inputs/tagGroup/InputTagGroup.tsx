import { Button, Key, Tag, TagGroup, TagList } from 'react-aria-components';
import { FieldValues, UseFormTrigger } from 'react-hook-form';

import IconClose from '@Components/svg/IconClose';

import styles from './InputTagGroup.module.scss';

type Props = {
  name: string;
  value: { id: number; name: string }[];
  onChange: (...event: unknown[]) => void;
  id: string;
  isInvalid: boolean;
  trigger: UseFormTrigger<FieldValues>;
};

function InputTagGroup(props: Props): React.JSX.Element {
  const { id, name, onChange, trigger, value, ...rest } = props;

  const onRemove = (ids: Set<Key>) => {
    const newList = value.filter((p) => !ids.has(p.id));
    onChange(newList);
    trigger(name);
  };

  return (
    <TagGroup onRemove={onRemove} aria-labelledby={id} className={styles.tagGroup} {...rest}>
      <TagList items={value || []} className={styles.tagList}>
        {(item: { id: number; name: string }) => (
          <Tag textValue={item.name} id={item.id} className={styles.tag}>
            {item.name}
            <Button slot="remove" className={styles.button}>
              <IconClose svgClass={styles.button__svg} />
            </Button>
          </Tag>
        )}
      </TagList>
    </TagGroup>
  );
}

export default InputTagGroup;
