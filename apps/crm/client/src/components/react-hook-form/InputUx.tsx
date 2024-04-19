import { PropsWithChildren } from 'react';
import { FieldError, FieldErrorsImpl, Merge, ValidationRule } from 'react-hook-form';
import styles from './_InputUX.module.scss';

interface IProps {
  label: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  isDirty?: boolean;
  isRequired?: string | ValidationRule<boolean> | undefined;
  isInvalid?: boolean;
}

// Wrapper: UX presentation for state of input; valid, invalid, focused, etc
function InputUx(props: PropsWithChildren<IProps>): JSX.Element {
  const { label, id, error, isDirty, isRequired, isInvalid, children } = props;
  const inputValidated = (isDirty && !error) || isInvalid === false;
  // console.log('LABEL:', label, isDirty, error, isInvalid);

  return (
    <div
      className={`${styles.inputUX} ${inputValidated ? styles.success : ''} ${isRequired ? styles.inputUX__required : ''}`}>
      {children}
      <label htmlFor={id} className={styles.inputUX__label}>
        {label}
      </label>
    </div>
  );
}

export default InputUx;
