import type { TValidationRules } from './validationRules';

import clsx from 'clsx';
import { HTMLAttributes, PropsWithChildren } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import styles from './InputUX.module.scss';

interface IProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  id: string;
  name: string;
  defaultValue?: string | number;
  disabled: boolean;
  rules: TValidationRules | undefined;
}

// Wrapper: UX presentation for state of input; valid, invalid, focused, disabled, etc
function InputUx(props: PropsWithChildren<IProps>): React.JSX.Element {
  const { children, defaultValue, disabled, id, label, name, rules, ...rest } = props;
  const { control } = useFormContext();
  const { errors, isDirty: dirty, isSubmitted, isValid } = useFormState({ name, control });

  const error = errors[name];
  const isDirty = !!defaultValue || dirty;
  const showErrorState = error && isSubmitted;
  const inputRequired = rules?.required && !isDirty && isSubmitted;

  return (
    <div
      {...rest}
      className={clsx(
        `${styles.inputUX}`,
        `${isValid ? styles.success : ''}`,
        `${inputRequired ? styles.inputUX__required : ''}`,
        `${showErrorState ? styles.error : ''}`
      )}
      aria-disabled={disabled}
      inert={disabled}>
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
