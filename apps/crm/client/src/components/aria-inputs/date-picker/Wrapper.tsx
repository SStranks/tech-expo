import { getLocalTimeZone, parseDate, today } from '@internationalized/date';
import { ValidationResult } from 'react-aria-components';
import { DeepRequired, FieldErrorsImpl, FieldValues, Merge, FieldError as TFieldError } from 'react-hook-form';

import InputDatePicker from './InputDatePicker';

import styles from './_InputDatePicker.module.scss';

const DATE_TODAY = today(getLocalTimeZone());

interface IProps<T extends FieldValues = FieldValues> {
  valueRHF: string | null;
  onChangeRHF: (...event: unknown[]) => void;
  isDirty?: boolean;
  isRequired?: boolean;
  error: TFieldError | Merge<TFieldError, FieldErrorsImpl<DeepRequired<T>>> | undefined;
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

function Wrapper({ error, isDirty, isRequired, onChangeRHF, valueRHF, ...props }: IProps): JSX.Element {
  const inputValidated = isDirty && !error;

  // RETURN to React-Hook-Form; convert from CalendarDate to string
  const onChange = (...e: unknown[]): void => {
    const dateConverted = e.toString(); // CalendarDate object has 'toString' method
    return onChangeRHF(dateConverted);
  };

  // SEND to React-Aria-Component; convert from string to CalendarDate
  const value = valueRHF === null || valueRHF === undefined || valueRHF === '' ? null : parseDate(valueRHF);

  return (
    <div
      className={`${styles.wrapper} ${inputValidated ? styles.success : ''} ${isRequired ? styles.wrapper__required : ''}`}>
      <InputDatePicker placeholderValue={DATE_TODAY} {...{ onChange, props, value }} />
    </div>
  );
}

export default Wrapper;
