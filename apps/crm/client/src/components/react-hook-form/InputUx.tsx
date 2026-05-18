import type { HTMLAttributes, PropsWithChildren } from 'react';

import type { ValidationRules } from './validationRules';

import clsx from 'clsx';
import { useFormContext, useFormState } from 'react-hook-form';

import styles from './InputUX.module.scss';

interface Props extends HTMLAttributes<HTMLDivElement> {
  label: string;
  id: string;
  name: string;
  defaultValue?: string;
  disabled: boolean;
  rules: ValidationRules | undefined;
}

// Wrapper: UX presentation for state of input; valid, invalid, focused, disabled, etc
function InputUx(props: PropsWithChildren<Props>): React.JSX.Element {
  const { children, disabled, id, label, name, rules, ...rest } = props;
  const { control, formState, getFieldState } = useFormContext();
  const { isSubmitted } = useFormState({ name, control });
  const { error, invalid, isDirty } = getFieldState(name, formState);

  const isInputRequired = rules?.required && !isDirty && isSubmitted;
  const isErrorState = error && isSubmitted;
  const isSuccessState = !invalid && isDirty;

  return (
    <div
      {...rest}
      className={clsx(
        `${styles.inputUX}`,
        `${isSuccessState ? styles.success : ''}`,
        `${isInputRequired ? styles.inputUX__required : ''}`,
        `${isErrorState ? styles.error : ''}`
      )}
      aria-disabled={disabled}
      inert={disabled}>
      {children}
      <label htmlFor={id} className={styles.inputUX__label} data-is-dirty={isDirty}>
        {label}
      </label>
      {isErrorState && (
        <span id={`${id}-error`} className={styles.inputUX__errorMessage} role="alert">
          {error.message as string}
        </span>
      )}
    </div>
  );
}

export default InputUx;
