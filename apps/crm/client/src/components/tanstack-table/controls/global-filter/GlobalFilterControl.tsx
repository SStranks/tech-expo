import type { Atom } from '@tanstack/react-store';

import { useEffect, useState } from 'react';
import { Button, Input, Label, SearchField } from 'react-aria-components';

import IconClose from '@Components/svg/IconClose';
import IconSearch from '@Components/svg/IconSearch';

import styles from './GlobalFilterControl.module.scss';

type Props = {
  globalFilterAtom: Atom<string>;
  label: string;
  debounceDelay?: number;
};

function GlobalFilterControl(props: Props): React.JSX.Element {
  const { debounceDelay = 250, globalFilterAtom, label } = props;
  const [debouncedValue, setDebouncedValue] = useState(globalFilterAtom.get());

  useEffect(() => {
    const handler = setTimeout(() => {
      globalFilterAtom.set(debouncedValue);
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, debounceDelay, globalFilterAtom]);

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
