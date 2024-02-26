import type { ZxcvbnResult } from '@zxcvbn-ts/core';
import { useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';
import { Control, FieldError, FieldValues, Path, UseFormRegister, UseFormTrigger, useWatch } from 'react-hook-form';
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
  control: Control<T>;
  trigger: UseFormTrigger<T>;
  inputName: Path<T>;
  isDirty: boolean | undefined;
  error: FieldError | undefined;
  reveal: boolean;
  label: string;
}

// TODO:  Style and reformat password information text
function InputPasswordStrength<T extends FieldValues>(props: IProps<T>): JSX.Element {
  const { register, control, trigger, inputName, isDirty, error, reveal, label } = props;
  const [passwordReveal, setPasswordReveal] = useState<boolean>(reveal);
  const [informationPanel, setInformationPanel] = useState<boolean>(false);
  const passwordValue = useWatch({ control, name: inputName });
  const result = usePasswordStrength(passwordValue);
  const id = useId();

  // Trigger re-validation; 'result' is a deferred value
  useEffect(() => {
    trigger(inputName);
  }, [trigger, inputName, result]);

  const revealPasswordClickHandler = () => {
    setPasswordReveal((p) => !p);
  };

  const revealInfoPanelClickHandler = () => {
    setInformationPanel((p) => !p);
  };

  const inputValidated = isDirty && !error;

  // Placeholder intentionally empty; style using :placeholder-shown
  return (
    <div className={styles.container}>
      <div className={`${styles.wrapper} ${inputValidated ? styles.success : ''}`}>
        <input
          {...register(inputName, { required: true, validate: () => result?.score === 4 })}
          type={passwordReveal ? 'text' : 'password'}
          id={`passwordInput-${inputName}-${id}`}
          className={styles.wrapper__input}
          placeholder=""
          aria-invalid={error ? true : false}
          autoComplete="new-password"
        />
        <label htmlFor={`passwordInput-${inputName}-${id}`} className={styles.wrapper__label}>
          {label}
        </label>
        <div className={styles.wrapper__icons}>
          <button type="button" onClick={revealPasswordClickHandler} className={styles.wrapper__icons__btn}>
            <img src={passwordReveal ? IconPassword : IconEye} alt="Reveal password toggle" />
          </button>
          <button className={styles.wrapper__icons__btn} onClick={revealInfoPanelClickHandler}>
            <img src={IconInfoCircle} alt="Password criteria information" />
          </button>
        </div>
      </div>
      <div className={styles.result}>
        <span className={`${styles.result__meter} ${styles[`result__meter--${result?.score}`]}`} />
      </div>
      <div className={`${styles.infoPanel} ${informationPanel ? styles.infoPanel__active : ''}`}>
        <div className={styles.infoPanel__inner}>
          <div className={styles.infoPanel__content}>
            <span className={styles.infoPanel__content__title}>Password Strength Criteria</span>
            <p className={styles.infoPanel__content__body}>
              No strict requirement for required character types, only that the password have sufficient entropy -
              varied character types do increase the entropy faster however.
            </p>
            <p className={styles.infoPanel__content__body}>
              Password entropy is calculated via the{' '}
              <Link to={'https://zxcvbn-ts.github.io/zxcvbn/guide/'} target="_blank">
                <span className={styles.infoPanel__content__link}>zxcvbn</span>
              </Link>{' '}
              library. This ensures provided passwords are more secure than following typical password guidelines.
            </p>
          </div>
        </div>
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
