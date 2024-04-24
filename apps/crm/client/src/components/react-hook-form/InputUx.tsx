import { PropsWithChildren } from 'react';
import { FieldError, ValidationRule } from 'react-hook-form';
import styles from './_InputUX.module.scss';

interface IProps {
  label: string;
  id: string;
  error: FieldError | undefined;
  isDirty?: boolean;
  isRequired?: string | ValidationRule<boolean> | undefined;
  isInvalid?: boolean;
  isSubmitted: boolean;
}

// Wrapper: UX presentation for state of input; valid, invalid, focused, etc
function InputUx(props: PropsWithChildren<IProps>): JSX.Element {
  const { label, id, error, isDirty, isRequired, isInvalid, isSubmitted, children } = props;
  const inputValidated = (isDirty && !error) || isInvalid === false;
  const showErrorState = error && isSubmitted;

  return (
    <div
      className={`${styles.inputUX} ${inputValidated ? styles.success : ''} ${isRequired && !isDirty ? styles.inputUX__required : ''} ${showErrorState ? styles.error : ''}`}>
      {children}
      <label htmlFor={id} className={styles.inputUX__label} data-is-dirty={isDirty}>
        {label}
      </label>
      {showErrorState && (
        <span id={`${id}-error`} className={styles.inputUX__errorMessage} role="alert">
          {error?.message}
        </span>
      )}
    </div>
  );
}

export default InputUx;
