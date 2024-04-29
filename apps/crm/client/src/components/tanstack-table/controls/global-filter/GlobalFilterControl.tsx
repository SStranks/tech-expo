import { SearchField, Input, Button, Label } from 'react-aria-components';
import { IconClose, IconSearch } from '#Components/svg';
import styles from './_GlobalFilterControl.module.scss';

interface IProps {
  label: string;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
}

function GlobalFilterControl(props: IProps): JSX.Element {
  const { label, globalFilter, setGlobalFilter } = props;

  return (
    <SearchField value={globalFilter} onChange={(e) => setGlobalFilter(e)} className={styles.searchField}>
      <Label className="invisibleAccessible">{label}</Label>
      <IconSearch svgClass={styles.iconSearch} />
      <Input className={styles.input} placeholder="Search contacts" />
      <Button className={styles.button}>
        <IconClose svgClass={styles.button__svg} />
      </Button>
    </SearchField>
  );
}
export default GlobalFilterControl;
