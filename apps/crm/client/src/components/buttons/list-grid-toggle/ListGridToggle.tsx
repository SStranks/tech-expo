import { IconGrid, IconList } from '#Components/svg';
import { Label, Radio, RadioGroup } from 'react-aria-components';
import styles from './_ListGridToggle.module.scss';

function ListGridToggle(): JSX.Element {
  return (
    <RadioGroup defaultValue="list" className={styles.radioGroup}>
      <Label></Label>
      <Radio value="list" className={styles.radio}>
        <IconList svgClass={styles.radio__svg} />
      </Radio>
      <Radio value="grid" className={styles.radio}>
        <IconGrid svgClass={styles.radio__svg} />
      </Radio>
    </RadioGroup>
  );
}

export default ListGridToggle;
