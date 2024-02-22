import { useState } from 'react';
import { FieldError, FieldValues, Path, UseFormRegister } from 'react-hook-form';
import { usePasswordStrength } from '#Lib/zxcvbn';
import type { ZxcvbnResult } from '@zxcvbn-ts/core';
import styles from './_InputPasswordStrength.module.scss';

const ARIA_LIVE = [
  'Password strength 0 out of 4: Too guessable',
  'Password strength 1 out of 4: Very guessable',
  'Password strength 2 out of 4: Somewhat guessable',
  'Password strength 3 out of 4: Safely unguessable',
  'Password strength 4 out of 4: Very unguessable',
];

const screenReaderText = (result: ZxcvbnResult | null) => {
  if (result) {
    return ARIA_LIVE[result.score];
  }
  return false;
};

interface IProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  inputName: Path<T>;
  placeholder: string;
  error: FieldError | undefined;
  reveal: boolean;
}

function InputPasswordStrength<T extends FieldValues>(props: IProps<T>): JSX.Element {
  const { register, inputName, placeholder, error, reveal } = props;
  const [passwordValue, setPasswordValue] = useState<string>('');
  const result = usePasswordStrength(passwordValue);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };

  return (
    <div className={`${styles.container} ${error ? styles.error : ''}`}>
      <div className={`${styles.result} ${styles[`result--${result?.score}`]}`} />
      <input
        {...register(inputName, { validate: () => result?.score === 4 })}
        type={reveal ? 'text' : 'password'}
        id={`passwordInput-${inputName}`}
        className={styles.container__input}
        name={inputName}
        value={passwordValue}
        placeholder={placeholder || ''}
        onChange={onChangeHandler}
        aria-label="password"
        aria-invalid={error ? true : false}
        autoComplete="new-password"
      />
      <output htmlFor={`passwordInput-${inputName}`} aria-live="polite" className="invisibleAccessible">
        {screenReaderText(result)}
      </output>
    </div>
  );
}

// Type required for <Suspense> component; generics require it
export type TInputPasswordStrength = typeof InputPasswordStrength;
export default InputPasswordStrength;
