import type { ComponentType } from 'react';

import { parseDate, parseTime } from '@internationalized/date';

/*
 * NOTE: InputCombo:
 * Clearing input returns NULL key; React-Hook-Form 'required' needs empty string to trigger validation error.
 */
const onChangeFunctions = {
  InputCombo: (e: unknown[]) => e[0] ?? '',
  InputComboTag: (e: unknown[]) => e[0],
  InputDatePicker: (e: unknown[]) => e.toString(), // CalendarDate object has 'toString' method
  InputNumber: (e: unknown[]) => e[0],
  InputSelect: (e: unknown[]) => e[0],
  InputTagGroup: (e: unknown[]) => e[0],
  InputTimeField: (e: unknown[]) => e.toString(),
};

const valueFunctions = {
  InputCombo: (v: unknown) => v ?? '',
  InputComboTag: (v: unknown) => v,
  InputDatePicker: (v: unknown) => (typeof v === 'string' && v.length > 0 ? parseDate(v) : null),
  InputNumber: (v: unknown) => v,
  InputSelect: (v: unknown) => v,
  InputTagGroup: (v: unknown) => v,
  InputTimeField: (v: unknown) => (typeof v === 'string' && v.length > 0 ? parseTime(v) : null),
};

interface Props<TComponentProps, TValue> {
  ReactAriaComponent: ComponentType<TComponentProps>;
  value: TValue;
  onChange: (value: TValue) => void;
}

/**
 * Wrapper Component: Manages data flow between libraries: React-Hook-Form, React-Aria-Components
 * @param ReactAriaComponent The React-Aria-Component component
 * @returns React-Aria-Component; React.JSX.Element
 */
function InputParser<TComponentProps, TValue>({
  ReactAriaComponent,
  ...props
}: Props<TComponentProps, TValue>): React.JSX.Element {
  // RETURN to React-Hook-Form; convert from CalendarDate to string
  const onChange = (...e: unknown[]): void => {
    const convertedValue = onChangeFunctions[ReactAriaComponent.name as keyof typeof onChangeFunctions](e) as TValue;
    return props.onChange(convertedValue);
  };

  // SEND to React-Aria-Component; convert from string to CalendarDate
  const value = valueFunctions[ReactAriaComponent.name as keyof typeof valueFunctions](props.value);

  /*
   * console.log('VALUE', value);
   * console.log('CHANGE', onChange);
   * console.log(props);
   */

  return <ReactAriaComponent {...(props as TComponentProps)} {...{ onChange, value }} />;
}

export default InputParser;
