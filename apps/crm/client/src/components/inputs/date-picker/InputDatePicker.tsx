import type { DatePickerProps, DateValue, ValidationResult } from 'react-aria-components';
import { useContext } from 'react';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarStateContext,
  DateInput,
  DatePicker,
  DatePickerStateContext,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  Text,
} from 'react-aria-components';
import { getLocalTimeZone, today } from '@internationalized/date';
import { IconArrowDownAlt, IconArrowLeftAlt, IconArrowLeftDoubleAlt } from '#Components/svg';
import styles from './_InputDatePicker.module.scss';

// Focus calendar on the date today
function ButtonToday(): JSX.Element {
  let state = useContext(DatePickerStateContext);
  const todayDate = today(getLocalTimeZone());

  return (
    <Button
      slot={null} // Don't inherit default Button behavior from DatePicker.
      className="clear-button"
      aria-label="Todays date"
      onPress={() => {
        state.setValue(todayDate);
        state.close();
      }}>
      Today
    </Button>
  );
}

// Advance/Recess calendar view by one year
function ButtonYear({ operation }: { operation: 'add' | 'subtract' }): JSX.Element {
  let state = useContext(CalendarStateContext);

  return (
    <Button
      slot={null}
      className="clear-button"
      aria-label="Previous Year"
      onPress={() => {
        state.setFocusedDate(state.focusedDate[`${operation}`]({ years: 1 }));
      }}>
      <IconArrowLeftDoubleAlt mirror={operation === 'add'} />
    </Button>
  );
}

interface MyDatePickerProps<T extends DateValue> extends DatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

function InputDatePicker<T extends DateValue>({ label, description, errorMessage, ...props }: MyDatePickerProps<T>) {
  return (
    <DatePicker {...props} className={styles.datePicker}>
      <Label className={styles.label}>{label}</Label>
      <Group className={styles.group}>
        <DateInput className={styles.dateInput}>
          {(segment) => <DateSegment segment={segment} className={styles.dateSegment} />}
        </DateInput>
        <Button className={styles.button}>
          <IconArrowDownAlt />
        </Button>
      </Group>
      {description && (
        <Text slot="description" className={styles.text}>
          {description}
        </Text>
      )}
      <FieldError>{errorMessage}</FieldError>
      <Popover className={styles.popover}>
        <Dialog className={styles.dialog}>
          <Calendar className={styles.calendar}>
            <header className={styles.calendar__header}>
              <ButtonYear operation="subtract" />
              <Button slot="previous" className={styles.calendar__buttonPrev}>
                <IconArrowLeftAlt />
              </Button>
              <Heading className={styles.calendar__heading} />
              <Button slot="next" className={styles.calendar__buttonNext}>
                <IconArrowLeftAlt mirror />
              </Button>
              <ButtonYear operation="add" />
            </header>
            <CalendarGrid className={styles.caldendarGrid}>
              {(date) => <CalendarCell date={date} className={styles.caldendarGrid__cell} />}
            </CalendarGrid>
            <ButtonToday />
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}

export default InputDatePicker;
