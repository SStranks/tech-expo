import { HTMLInputTypeAttribute, useId } from 'react';
import { FieldError, FieldErrorsImpl, Merge, UseFormRegisterReturn } from 'react-hook-form';
import styles from './_Input.module.scss';

interface IProps {
  register: UseFormRegisterReturn;
  isDirty: boolean | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  type: HTMLInputTypeAttribute;
  label: string;
}

function Input(props: IProps): JSX.Element {
  const { register, type, error, isDirty, label } = props;
  const id = useId();

  const inputValidated = isDirty && !error;

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <div className={`${styles.wrapper} ${inputValidated ? styles.success : ''}`}>
      <input
        {...register}
        type={type}
        id={`input-${type}-${id}`}
        className={styles.wrapper__input}
        placeholder=""
        aria-invalid={error ? true : false}
      />
      <label htmlFor={`input-${type}-${id}`} id="test" className={styles.wrapper__label}>
        {label}
      </label>
    </div>
  );
}

export default Input;
