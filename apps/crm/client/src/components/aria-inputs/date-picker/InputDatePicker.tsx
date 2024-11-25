import type { DatePickerProps, DateValue, ValidationResult } from 'react-aria-components';

import { getLocalTimeZone, today } from '@internationalized/date';
import { useContext } from 'react';
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
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

import { IconArrowDownAlt, IconArrowLeftAlt, IconArrowLeftDoubleAlt } from '#Components/svg';

import styles from './_InputDatePicker.module.scss';

const DATE_TODAY = today(getLocalTimeZone());

// Focus calendar on the date today
function ButtonToday(): JSX.Element {
  let state = useContext(DatePickerStateContext);

  return (
    <Button
      slot={null} // Don't inherit default Button behavior from DatePicker.
      className={styles.calendar__buttonToday}
      aria-label="Todays date"
      onPress={() => {
        state.setValue(DATE_TODAY);
        state.close();
      }}>
      Today
    </Button>
  );
}

interface IButtonYearProps {
  operation: 'add' | 'subtract';
  className?: string;
}

// Advance/Recess calendar view by one year
function ButtonYear({ className = undefined, operation }: IButtonYearProps): JSX.Element {
  let state = useContext(CalendarStateContext);

  return (
    <Button
      slot={null}
      className={`${styles.calendar__buttonYear} ${className}`}
      aria-label={`${operation === 'add' ? 'Next Year' : 'Previous Year'}`}
      onPress={() => {
        state.setFocusedDate(state.focusedDate[`${operation}`]({ years: 1 }));
      }}>
      <IconArrowLeftDoubleAlt mirror={operation === 'add'} svgClass={styles.icon} />
    </Button>
  );
}

interface MyDatePickerProps<T extends DateValue> extends DatePickerProps<T> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

function InputDatePicker<T extends DateValue>({ description, errorMessage, label, ...props }: MyDatePickerProps<T>) {
  return (
    <DatePicker {...props} className={styles.datePicker}>
      <Label className={styles.label}>
        {label && <span>{label}</span>}
        {/* // NOTE:  Hidden input linked to external Label by Id */}
        <input id={props.id} hidden />
      </Label>
      <Group className={styles.group}>
        <DateInput className={styles.dateInput}>
          {(segment) => <DateSegment segment={segment} className={styles.dateSegment} />}
        </DateInput>
        <Button className={styles.button}>
          <IconArrowDownAlt svgClass={styles.button__svg} />
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
                <IconArrowLeftAlt svgClass={styles.icon} />
              </Button>
              <Heading className={styles.calendar__heading} />
              <Button slot="next" className={styles.calendar__buttonNext}>
                <IconArrowLeftAlt mirror svgClass={styles.icon} />
              </Button>
              <ButtonYear operation="add" />
            </header>
            <CalendarGrid weekdayStyle={'narrow'} className={styles.calendarGrid}>
              <CalendarGridHeader className={styles.calendarGrid__header}>
                {(day) => <CalendarHeaderCell className={styles.calendarGrid__header__cell}>{day}</CalendarHeaderCell>}
              </CalendarGridHeader>
              <CalendarGridBody className={styles.calendarGrid__body}>
                {(date) => (
                  <CalendarCell
                    date={date}
                    className={`${styles.calendarGrid__cell} ${date.compare(DATE_TODAY) === 0 ? `${styles.calendarGrid__cell__today}` : ''}`}
                  />
                )}
              </CalendarGridBody>
            </CalendarGrid>
            <ButtonToday />
          </Calendar>
        </Dialog>
      </Popover>
    </DatePicker>
  );
}

export default InputDatePicker;
