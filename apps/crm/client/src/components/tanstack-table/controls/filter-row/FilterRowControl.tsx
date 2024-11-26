import type { Column } from '@tanstack/react-table';

import { useId, useState } from 'react';
import { Button, DialogTrigger, Input, Popover, SearchField } from 'react-aria-components';

import { IconFilter } from '@Components/svg';

import styles from './FilterRowControl.module.scss';

interface IProps {
  column: Column<any, unknown>;
  fieldName: string;
}

function FilterRowControl(props: IProps): JSX.Element {
  const { column, fieldName } = props;
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [filterActive, setFilterActive] = useState<boolean>(column.getIsFiltered);
  const [inputValue, setInputValue] = useState<string>((column.getFilterValue() ?? '') as string);
  const componentId = useId();

  const popoverTriggerBtnHandler = () => {
    setPopoverOpen((p) => !p);
  };

  const onFormSubmit = (e: string) => {
    setInputValue(e);
    setFilterActive(inputValue !== '');
    column.setFilterValue(inputValue);
  };

  const clearFilterBtnHandler = () => {
    column.setFilterValue('');
    setInputValue('');
    setFilterActive(false);
    setPopoverOpen(false);
  };

  return (
    <DialogTrigger>
      <Button
        id={componentId}
        aria-label={`Filter table by ${fieldName}`}
        onPress={popoverTriggerBtnHandler}
        className={`${styles.triggerBtn} ${filterActive ? styles.triggerBtn__active : ''}`}>
        <IconFilter svgClass={`${styles.svg} ${popoverOpen || filterActive ? styles.svg__active : ''}`} />
      </Button>
      <Popover isOpen={popoverOpen} onOpenChange={setPopoverOpen} placement="bottom left" className={styles.popover}>
        <SearchField
          value={inputValue}
          onChange={(e) => setInputValue(e)}
          onSubmit={onFormSubmit}
          className={styles.searchField}
          aria-labelledby={componentId}>
          <Input placeholder={`Search ${fieldName}`} className={styles.input} />
          <div className={styles.popover__controls}>
            <Button onPress={() => onFormSubmit(inputValue)} className={styles.filterBtn}>
              <IconFilter svgClass={`${styles.svg} ${styles.filterBtn__svg}`} />
              Filter
            </Button>
            <Button onPress={clearFilterBtnHandler} className={styles.clearBtn}>
              Clear
            </Button>
          </div>
        </SearchField>
      </Popover>
    </DialogTrigger>
  );
}

export default FilterRowControl;
