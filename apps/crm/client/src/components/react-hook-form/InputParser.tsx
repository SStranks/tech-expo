import { ComponentType } from 'react';
import { parseDate } from '@internationalized/date';

const onChangeFunctions = {
  InputCombo: (e: unknown[]) => e[0] ?? '', // Clearing input returns NULL key; React-Hook-Form 'required' needs empty string to trigger validation error.
  InputDatePicker: (e: unknown[]) => e.toString(), // CalendarDate object has 'toString' method
  InputNumber: (e: unknown[]) => {
    // eslint-disable-next-line unicorn/prefer-number-properties
    return isNaN(e[0] as number) ? undefined : e[0];
  },
  InputSelect: (e: unknown[]) => e[0],
};

const valueFunctions = {
  InputCombo: (v: unknown) => v ?? '',
  InputDatePicker: (v: unknown) => (typeof v === 'string' && (v as string).length > 0 ? parseDate(v as string) : null),
  InputNumber: (v: unknown) => v ?? Number.NaN,
  InputSelect: (v: unknown) => v,
};

interface IProps<T> {
  ReactAriaComponent: ComponentType<T>;
  value: unknown;
  onChange: (...event: unknown[]) => void;
}

/**
 * Wrapper Component: Manages data flow between libraries: React-Hook-Form, React-Aria-Components
 * @param ReactAriaComponent The React-Aria-Component component
 * @returns React-Aria-Component; JSX.Element
 */
function InputParser<T>({ ReactAriaComponent, ...props }: IProps<T>): JSX.Element {
  // RETURN to React-Hook-Form; convert from CalendarDate to string
  const onChange = (...e: unknown[]): void => {
    const convertedValue = onChangeFunctions[ReactAriaComponent.name as keyof typeof onChangeFunctions](e);
    // console.log(e, convertedValue);
    return props.onChange(convertedValue);
  };

  // SEND to React-Aria-Component; convert from string to CalendarDate
  const value = valueFunctions[ReactAriaComponent.name as keyof typeof valueFunctions](props.value);
  // console.log(value, props.value);

  return <ReactAriaComponent {...(props as T)} {...{ onChange, value }} />;
}

export default InputParser;
