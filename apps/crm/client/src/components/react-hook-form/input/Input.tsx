import { HTMLInputTypeAttribute } from 'react';
import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn, ValidationRule } from 'react-hook-form';

import styles from './Input.module.scss';

interface IProps {
  register: UseFormRegisterReturn;
  type: HTMLInputTypeAttribute;
  id: string;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  isRequired: string | ValidationRule<boolean> | undefined;
  defaultValue?: string;
}

function Input(props: IProps): React.JSX.Element {
  const { defaultValue, error, id, isRequired, register, type, ...rest } = props;

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <input
      {...register}
      {...rest}
      type={type}
      id={id}
      className={styles.input}
      defaultValue={defaultValue}
      placeholder=""
      aria-invalid={error ? true : false}
      aria-required={isRequired ? true : false}
      aria-describedby={`${id}-error`}
    />
  );
}

export default Input;
