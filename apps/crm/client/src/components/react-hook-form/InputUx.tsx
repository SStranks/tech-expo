import { PropsWithChildren } from 'react';
import { FieldError, FieldErrorsImpl, Merge, ValidationRule } from 'react-hook-form';
import styles from './_InputUX.module.scss';

interface IProps {
  label: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  isDirty: boolean | undefined;
  isRequired?: string | ValidationRule<boolean> | undefined;
  invalid: boolean;
  isSubmitted: boolean;
}

// Wrapper: UX presentation for state of input; valid, invalid, focused, etc
function InputUx(props: PropsWithChildren<IProps>): JSX.Element {
  const { label, id, error, isDirty, isRequired, invalid, isSubmitted, children } = props;
  const inputValidated = isDirty && !invalid;
  const showErrorState = error && isSubmitted;

  // console.log(inputValidated, isDirty, invalid);

  return (
    <div
      className={`${styles.inputUX} ${inputValidated ? styles.success : ''} ${isRequired && !isDirty ? styles.inputUX__required : ''} ${showErrorState ? styles.error : ''}`}>
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
