import type { TValidationRules } from './validationRules';

import clsx from 'clsx';
import { PropsWithChildren } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import styles from './InputUX.module.scss';

interface IProps {
  label: string;
  id: string;
  name: string;
  defaultValue?: string | number;
  rules?: TValidationRules;
  testId?: string;
}

// Wrapper: UX presentation for state of input; valid, invalid, focused, etc
function InputUx(props: PropsWithChildren<IProps>): React.JSX.Element {
  const { children, defaultValue, id, label, name, rules, testId } = props;
  const { control } = useFormContext();
  const { errors, isDirty, isSubmitted } = useFormState({ name, control });

  const error = errors[name];
  const inputValidated = !error && (defaultValue || isDirty);
  const showErrorState = error && isSubmitted;
  const inputRequired = rules?.required && !isDirty && isSubmitted;

  return (
    <div
      className={clsx(
        `${styles.inputUX}`,
        `${inputValidated ? styles.success : ''}`,
        `${inputRequired ? styles.inputUX__required : ''}`,
        `${showErrorState ? styles.error : ''}`
      )}
      data-testid={testId}>
      {children}
      <label htmlFor={id} className={styles.inputUX__label} data-is-dirty={isDirty}>
        {label}
      </label>
      {showErrorState && (
        <span id={`${id}-error`} className={styles.inputUX__errorMessage} role="alert">
          {error?.message as string}
        </span>
      )}
    </div>
  );
}

export default InputUx;
