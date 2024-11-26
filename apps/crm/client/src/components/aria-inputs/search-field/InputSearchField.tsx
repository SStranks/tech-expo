import { Button, Input, Label, SearchField } from 'react-aria-components';

import styles from './InputSearchField.module.scss';

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
