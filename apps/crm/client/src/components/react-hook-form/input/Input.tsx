import { HTMLInputTypeAttribute, useId } from 'react';
import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from 'react-hook-form';
import styles from './_Input.module.scss';

interface IProps {
  register: UseFormRegisterReturn;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  type: HTMLInputTypeAttribute;
  label: string;
}

function Input(props: IProps): JSX.Element {
  const { register, type, error, label } = props;
  const id = useId();

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <>
      <input
        {...register}
        type={type}
        id={`input-${type}-${id}`}
        className={styles.wrapper__input}
        placeholder=""
        aria-invalid={error ? true : false}
      />
      <label htmlFor={`input-${type}-${id}`} className={styles.wrapper__label}>
        {label}
      </label>
    </>
  );
}

export default Input;
