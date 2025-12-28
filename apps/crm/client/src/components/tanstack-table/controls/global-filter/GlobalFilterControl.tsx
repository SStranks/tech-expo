import { useEffect, useState } from 'react';
import { Button, Input, Label, SearchField } from 'react-aria-components';

import IconClose from '@Components/svg/IconClose';
import IconSearch from '@Components/svg/IconSearch';

import styles from './GlobalFilterControl.module.scss';

interface IProps {
  label: string;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  debounceDelay?: number;
}

function GlobalFilterControl(props: IProps): React.JSX.Element {
  const { debounceDelay = 250, globalFilter, label, setGlobalFilter } = props;
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
      <Input className={styles.input} placeholder={label} />
      <Button className={styles.button}>
        <IconClose svgClass={styles.button__svg} />
      </Button>
    </SearchField>
  );
}
export default GlobalFilterControl;
