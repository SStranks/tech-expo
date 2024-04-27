import { SearchField, Input, Button, Label } from 'react-aria-components';
import styles from './_InputSearchField.module.scss';
import { IconClose, IconSearch } from '#Components/svg';

interface IProps {
  label: string;
}

function InputSearchField(props: IProps): JSX.Element {
  const { label } = props;

  return (
    <SearchField className={styles.searchField}>
      <Label className="invisibleAccessible">{label}</Label>
      <IconSearch svgClass={styles.iconSearch} />
      <Input className={styles.input} placeholder="Contact name" />
      <Button className={styles.button}>
        <IconClose svgClass={styles.button__svg} />
      </Button>
    </SearchField>
  );
}
export default InputSearchField;
