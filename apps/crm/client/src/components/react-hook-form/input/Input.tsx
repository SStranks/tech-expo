import { HTMLInputTypeAttribute } from 'react';
import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from 'react-hook-form';
import styles from './_Input.module.scss';

interface IProps {
  register: UseFormRegisterReturn;
  type: HTMLInputTypeAttribute;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
}

function Input(props: IProps): JSX.Element {
  const { register, type, id, error } = props;

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <input
      {...register}
      type={type}
      id={id}
      className={styles.wrapper__input}
      placeholder=""
      aria-invalid={error ? true : false}
    />
  );
}

export default Input;
