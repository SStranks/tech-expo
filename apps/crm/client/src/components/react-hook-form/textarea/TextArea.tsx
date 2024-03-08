import { ChangeEvent, useId } from 'react';
import {
  DeepRequired,
  FieldError,
  FieldErrorsImpl,
  FieldValues,
  Merge,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import styles from './_TextArea.module.scss';

// Automatically resizes textarea dependent on user input
const autoHeightResize = (e: ChangeEvent<HTMLTextAreaElement>) => {
  e.target.style.height = 'auto';
  e.target.style.height = e.target.scrollHeight + 'px';
};

interface IProps<T extends FieldValues = FieldValues> {
  register: UseFormRegister<FieldValues>;
  name: string;
  rules: RegisterOptions;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<DeepRequired<T>>> | undefined;
  label: string;
}

function TextArea(props: IProps): JSX.Element {
  const { register, name, rules, error, label } = props;
  const id = useId();

  // const inputValidated = isDirty && !error;

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    // <div className={`${styles.wrapper} ${inputValidated ? styles.success : ''}`}>
    <>
      <textarea
        {...register(name, { ...rules, onChange: (e) => autoHeightResize(e) })}
        id={`textarea-${id}`}
        className={styles.wrapper__textarea}
        placeholder=""
        aria-invalid={error ? true : false}
      />
      <label htmlFor={`textarea-${id}`} className={styles.wrapper__label}>
        {label}
      </label>
    </>
    // </div>
  );
}

export default TextArea;
