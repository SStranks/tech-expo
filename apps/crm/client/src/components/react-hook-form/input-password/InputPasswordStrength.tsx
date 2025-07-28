import type { ZxcvbnResult } from '@zxcvbn-ts/core';

import { useEffect, useId, useState } from 'react';
import {
  Control,
  FieldError,
  FieldValues,
  Path,
  UseFormRegister,
  UseFormTrigger,
  useWatch,
  ValidationRule,
} from 'react-hook-form';
import { Link } from 'react-router-dom';

import { IconCircleInfo, IconEye, IconPassword } from '@Components/svg';
import { usePasswordStrength } from '@Lib/zxcvbn';

import InputUx from '../InputUx';

import styles from './InputPasswordStrength.module.scss';

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
  defaultValue: string | undefined;
  isDirty: boolean | undefined;
  invalid: boolean;
  isRequired: string | ValidationRule<boolean> | undefined;
  isSubmitted: boolean;
  error: FieldError | undefined;
  reveal: boolean;
  label: string;
}

// TODO:  Style and reformat password information text
function InputPasswordStrength<T extends FieldValues>(props: IProps<T>): React.JSX.Element {
  const {
    control,
    defaultValue,
    error,
    inputName,
    invalid,
    isDirty,
    isRequired,
    isSubmitted,
    label,
    register,
    reveal,
    trigger,
  } = props;
  const [passwordReveal, setPasswordReveal] = useState<boolean>(reveal);
  const [informationPanel, setInformationPanel] = useState<boolean>(false);
  const passwordValue = useWatch({ name: inputName, control });
  const result = usePasswordStrength(passwordValue);
  const passwordId = useId();

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

  const VALIDATION_RULES = {
    required: { message: 'Please enter strong password', value: true },
    validate: () => result?.score === 4 || 'Password is insufficiently strong',
  };

  return (
    <div className={styles.container}>
      <InputUx
        label={label}
        id={passwordId}
        defaultValue={defaultValue}
        isDirty={isDirty}
        invalid={invalid}
        isRequired={VALIDATION_RULES.required}
        error={error}
        isSubmitted={isSubmitted}>
        <input
          {...register(inputName, VALIDATION_RULES)}
          type={passwordReveal ? 'text' : 'password'}
          id={passwordId}
          className={styles.inputPassword}
          placeholder="" // Placeholder intentionally empty; style using :placeholder-shown
          aria-invalid={error ? true : false}
          aria-required={isRequired ? true : false}
          autoComplete="new-password"
        />
        <div className={styles.icons}>
          <button type="button" onClick={revealPasswordClickHandler} className={styles.icons__btn}>
            {passwordReveal ? (
              <IconPassword svgClass={styles.icons__btn__svg} />
            ) : (
              <IconEye svgClass={styles.icons__btn__svg} />
            )}
          </button>
          <button className={styles.icons__btn} onClick={revealInfoPanelClickHandler}>
            <IconCircleInfo svgClass={styles.icons__btn__svg} />
          </button>
        </div>
      </InputUx>
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
              <Link to="https://zxcvbn-ts.github.io/zxcvbn/guide/" target="_blank">
                <span className={styles.infoPanel__content__link}>zxcvbn</span>
              </Link>{' '}
              library. This ensures provided passwords are more secure than following typical password guidelines.
            </p>
          </div>
        </div>
      </div>
      <output htmlFor={passwordId} aria-live="polite" className="invisibleAccessible">
        {screenReaderText(result)}
      </output>
    </div>
  );
}

// Type required for <Suspense> component; generics require it
export type TInputPasswordStrength = typeof InputPasswordStrength;
export default InputPasswordStrength;
