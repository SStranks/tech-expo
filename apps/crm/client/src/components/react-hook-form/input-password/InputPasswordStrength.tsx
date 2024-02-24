import type { ZxcvbnResult } from '@zxcvbn-ts/core';
import { useEffect, useId, useState } from 'react';
import {
  FieldError,
  FieldValues,
  Path,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';
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
  setValue: UseFormSetValue<T>;
  inputName: Path<T>;
  invalid: boolean;
  isDirty: boolean;
  error: FieldError | undefined;
  reveal: boolean;
  label: string;
}

function InputPasswordStrength<T extends FieldValues>(props: IProps<T>): JSX.Element {
  const { register, trigger, setValue, inputName, invalid, isDirty, reveal, label } = props;
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [passwordReveal, setPasswordReveal] = useState<boolean>(reveal);
  const result = usePasswordStrength(passwordValue);
  const id = useId();

  // Trigger manual revalidation check; 'result' is a deferred value.
  useEffect(() => {
    trigger(inputName);
  }, [result, inputName, trigger]);

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
    // HACK:  Can we do away with the type casting here?
    setValue(inputName, e.target.value as PathValue<T, Path<T>>, {
      shouldDirty: true,
      shouldValidate: false,
      shouldTouch: true,
    });
  };

  const revealPasswordClickHandler = () => {
    setPasswordReveal((p) => !p);
  };

  const inputValidated = isDirty && !invalid;

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <div className={styles.container}>
      <div className={`${styles.wrapper} ${inputValidated ? styles.success : ''}`}>
        <input
          {...register(inputName, { validate: () => result?.score === 4 })}
          type={passwordReveal ? 'text' : 'password'}
          id={`passwordInput-${inputName}-${id}`}
          className={styles.wrapper__input}
          name={inputName}
          value={'' || passwordValue}
          placeholder=""
          onChange={onChangeHandler}
          // aria-invalid={error ? true : false}
          autoComplete="new-password"
        />
        <label className={styles.wrapper__label}>{label}</label>
        <div className={styles.wrapper__icons}>
          <button type="button" onClick={revealPasswordClickHandler} className={styles.input__icons__btn}>
            <img src={passwordReveal ? IconPassword : IconEye} alt="Reveal password toggle" />
          </button>
          <button className={styles.input__icons__btn}>
            <img src={IconInfoCircle} alt="Password criteria information" />
          </button>
        </div>
      </div>
      <div className={styles.result}>
        <span className={`${styles.result__meter} ${styles[`result__meter--${result?.score}`]}`} />
      </div>
      <output htmlFor={`passwordInput-${inputName}-${id}`} aria-live="polite" className="invisibleAccessible">
        {screenReaderText(result)}
      </output>
    </div>
  );
}

// Type required for <Suspense> component; generics require it
export type TInputPasswordStrength = typeof InputPasswordStrength;
export default InputPasswordStrength;
