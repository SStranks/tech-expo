import { SearchField, Label, Input, Button } from 'react-aria-components';
import styles from './_InputSearchField.module.scss';

function InputSearchField(): JSX.Element {
  return (
    <SearchField className={styles.searchField}>
      <Label></Label>
      <Input />
      <Button></Button>
    </SearchField>
  );
}
export default InputSearchField;
