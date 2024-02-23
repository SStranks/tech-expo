import { HTMLInputTypeAttribute } from 'react';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';
import styles from './_Input.module.scss';

interface IProps {
  register: UseFormRegisterReturn;
  type: HTMLInputTypeAttribute;
  invalid: boolean;
  error: FieldError | undefined;
  isDirty: boolean;
  ariaLabel: string;
}

function Input(props: IProps): JSX.Element {
  const { register, type, invalid, error, isDirty, ariaLabel } = props;

  console.log(invalid, isDirty);

  return (
    <label className={`${styles.label} ${isDirty && !invalid ? styles.success : ''}`} aria-label={ariaLabel}>
      <input {...register} type={type} className={styles.label__input} aria-invalid={error ? true : false} />
    </label>
  );
}

export default Input;
