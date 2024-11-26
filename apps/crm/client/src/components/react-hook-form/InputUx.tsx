import { PropsWithChildren } from 'react';
import { FieldError, FieldErrorsImpl, Merge, ValidationRule } from 'react-hook-form';

import styles from './InputUX.module.scss';

interface IProps {
  label: string;
  id: string;
  defaultValue: string | number | undefined;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  isDirty: boolean | undefined;
  isRequired?: string | ValidationRule<boolean> | undefined;
  invalid: boolean;
  isSubmitted: boolean;
}

// Wrapper: UX presentation for state of input; valid, invalid, focused, etc
function InputUx(props: PropsWithChildren<IProps>): JSX.Element {
  const { children, defaultValue, error, id, invalid, isDirty, isRequired, isSubmitted, label } = props;
  const inputValidated = !error && (defaultValue || (isDirty && !invalid));
  const showErrorState = error && isSubmitted;
  const inputRequired = isRequired && invalid;

  // console.log(isDirty, invalid, error, isSubmitted);

  return (
    <div
      className={`${styles.inputUX} ${inputValidated ? styles.success : ''} ${inputRequired ? styles.inputUX__required : ''} ${showErrorState ? styles.error : ''}`}>
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
