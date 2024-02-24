import { HTMLInputTypeAttribute, useId } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import styles from './_Input.module.scss';

interface IProps {
  register: UseFormRegisterReturn;
  invalid: boolean;
  isDirty: boolean;
  error: FieldError | undefined;
  type: HTMLInputTypeAttribute;
  label: string;
}

function Input(props: IProps): JSX.Element {
  const { register, type, invalid, error, isDirty, label } = props;
  const id = useId();

  const inputValidated = isDirty && !invalid;

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
      <label htmlFor={`input-${type}-${id}`} className={styles.wrapper__label}>
        {label}
      </label>
    </div>
  );
}

export default Input;
