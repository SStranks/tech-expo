import { SearchField, Input, Button } from 'react-aria-components';
import styles from './_InputSearchField.module.scss';
import { IconClose, IconSearch } from '#Components/svg';

function InputSearchField(): JSX.Element {
  return (
    <SearchField className={styles.searchField}>
      <IconSearch svgClass={styles.iconSearch} />
      <Input className={styles.input} placeholder="Contact name" aria-label="Search Contacts" />
      <Button className={styles.button}>
        <IconClose svgClass={styles.button__svg} />
      </Button>
    </SearchField>
  );
}
export default InputSearchField;
