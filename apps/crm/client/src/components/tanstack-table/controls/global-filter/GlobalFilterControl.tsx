import { useEffect, useState } from 'react';
import { SearchField, Input, Button, Label } from 'react-aria-components';
import { IconClose, IconSearch } from '#Components/svg';
import styles from './_GlobalFilterControl.module.scss';

interface IProps {
  label: string;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  debounceDelay: number;
}

function GlobalFilterControl(props: IProps): JSX.Element {
  const { label, globalFilter, setGlobalFilter, debounceDelay } = props;
  const [debouncedValue, setDebouncedValue] = useState(globalFilter);

  useEffect(() => {
    const handler = setTimeout(() => {
      setGlobalFilter(debouncedValue);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, debounceDelay, setGlobalFilter]);

  return (
    <SearchField value={debouncedValue} onChange={(e) => setDebouncedValue(e)} className={styles.searchField}>
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
