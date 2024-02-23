import type { ZxcvbnResult } from '@zxcvbn-ts/core';
import { useEffect, useRef, useState } from 'react';
import { FieldError, FieldValues, Path, UseFormRegister, UseFormSetFocus, UseFormTrigger } from 'react-hook-form';
import { usePasswordStrength } from '#Lib/zxcvbn';
import { IconInfoCircle, IconPassword, IconEye } from '#Svg/icons';
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
  trigger: UseFormTrigger<T>;
  setFocus: UseFormSetFocus<T>;
  inputName: Path<T>;
  placeholder: string;
  error: FieldError | undefined;
  reveal: boolean;
}

function InputPasswordStrength<T extends FieldValues>(props: IProps<T>): JSX.Element {
  const { register, trigger, inputName, placeholder, error, reveal } = props;
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [passwordReveal, setPasswordReveal] = useState<boolean>(reveal);
  const result = usePasswordStrength(passwordValue);
  const inputPasswordRef = useRef<HTMLInputElement>(null);

  // Trigger manual revalidation check; 'result' is a deferred value.
  useEffect(() => {
    trigger(inputName);
  }, [result, inputName, trigger]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };

  const revealPasswordClickHandler = () => {
    setPasswordReveal((p) => !p);
  };

  return (
    <div className={`${styles.container} ${error ? styles.error : ''}`}>
      <label className={styles.input} aria-label="password">
        <input
          {...register(inputName, { validate: () => result?.score === 4 })}
          type={passwordReveal ? 'text' : 'password'}
          id={`passwordInput-${inputName}`}
          className={styles.input__field}
          name={inputName}
          value={passwordValue}
          placeholder={placeholder || ''}
          onChange={onChangeHandler}
          aria-invalid={error ? true : false}
          autoComplete="new-password"
          ref={inputPasswordRef}
        />
        <div className={styles.input__icons}>
          <button type="button" onClick={revealPasswordClickHandler} className={styles.input__icons__btn}>
            <img src={passwordReveal ? IconPassword : IconEye} alt="Reveal password toggle" />
          </button>
          <button className={styles.input__icons__btn}>
            <img src={IconInfoCircle} alt="Password criteria information" />
          </button>
        </div>
      </label>
      <div className={styles.result}>
        <span className={`${styles.result__meter} ${styles[`result__meter--${result?.score}`]}`} />
      </div>
      <output htmlFor={`passwordInput-${inputName}`} aria-live="polite" className="invisibleAccessible">
        {screenReaderText(result)}
      </output>
    </div>
  );
}

// Type required for <Suspense> component; generics require it
export type TInputPasswordStrength = typeof InputPasswordStrength;
export default InputPasswordStrength;
