import { HTMLInputTypeAttribute } from 'react';
import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn, ValidationRule } from 'react-hook-form';
import styles from './_Input.module.scss';

interface IProps {
  register: UseFormRegisterReturn;
  type: HTMLInputTypeAttribute;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  isRequired: string | ValidationRule<boolean> | undefined;
}

function Input(props: IProps): JSX.Element {
  const { register, type, id, error, isRequired } = props;

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <input
      {...register}
      type={type}
      id={id}
      className={styles.input}
      placeholder=""
      aria-invalid={error ? true : false}
      aria-required={isRequired ? true : false}
      aria-describedby={`${id}-error`}
    />
  );
}

export default Input;
