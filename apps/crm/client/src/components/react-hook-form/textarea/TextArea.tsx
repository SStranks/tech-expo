import { ChangeEvent } from 'react';
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
  id: string;
  name: string;
  rules: RegisterOptions;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<DeepRequired<T>>> | undefined;
  label: string;
}

function TextArea(props: IProps): JSX.Element {
  const { register, id, name, rules, error } = props;

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <textarea
      {...register(name, { ...rules, onChange: (e) => autoHeightResize(e) })}
      id={id}
      className={styles.textarea}
      placeholder=""
      aria-invalid={error ? true : false}
    />
  );
}

export default TextArea;
