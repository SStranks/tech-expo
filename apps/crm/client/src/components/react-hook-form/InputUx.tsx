import { PropsWithChildren } from 'react';
import { FieldError, FieldErrorsImpl, Merge, ValidationRule } from 'react-hook-form';
import styles from './_InputUX.module.scss';

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorMessage: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  isDirty?: boolean;
  isRequired?: string | ValidationRule<boolean> | undefined;
}

// Wrapper: UX presentation for state of input; valid, invalid, focused, etc
function InputUx(props: PropsWithChildren<IProps>): JSX.Element {
  const { errorMessage, isDirty, isRequired, children } = props;
  const inputValidated = isDirty && !errorMessage;

  return (
    <div
      className={`${styles.wrapper} ${inputValidated ? styles.success : ''} ${isRequired ? styles.wrapper__required : ''}`}>
      {children}
    </div>
  );
}

export default InputUx;
