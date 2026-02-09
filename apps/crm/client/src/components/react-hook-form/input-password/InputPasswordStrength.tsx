import type { Score } from '@zxcvbn-ts/core';
import type { FieldValues, Path } from 'react-hook-form';

import { useEffect, useId, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';

import IconCircleInfo from '@Components/svg/IconCircleInfo';
import IconEye from '@Components/svg/IconEye';
import IconPassword from '@Components/svg/IconPassword';
import { usePasswordStrength } from '@Lib/zxcvbn';

import Input from '../input/Input';
import InputUx from '../InputUx';
import { PASSWORD_STRENGTH_RULES } from '../validationRules';

import styles from './InputPasswordStrength.module.scss';

export const ARIA_LIVE_MESSAGES = [
  'Password strength 0 out of 4: Too guessable',
  'Password strength 1 out of 4: Very guessable',
  'Password strength 2 out of 4: Somewhat guessable',
  'Password strength 3 out of 4: Safely unguessable',
  'Password strength 4 out of 4: Very unguessable',
];

const screenReaderText = (passwordScore: Score | null) => {
  if (passwordScore !== null) {
    return ARIA_LIVE_MESSAGES[passwordScore];
  }

  return false;
};

type Props<T extends FieldValues> = {
  defaultValue: string | undefined;
  label: string;
  name: Path<T>;
  reveal: boolean;
};

// TODO:  Style and reformat password information text
function InputPasswordStrength<T extends FieldValues>(props: Props<T>): React.JSX.Element {
  const { defaultValue, label, name, reveal } = props;
  const { control, trigger } = useFormContext<T>();
  const [passwordReveal, setPasswordReveal] = useState<boolean>(reveal);
  const [informationPanel, setInformationPanel] = useState<boolean>(false);
  const passwordValue = useWatch({ name, control });
  const passwordScore = usePasswordStrength(passwordValue);
  const passwordId = useId();

  // Trigger re-validation; 'result' is a deferred value
  useEffect(() => {
    void trigger(name);
  }, [trigger, name, passwordScore]);

  const revealPasswordClickHandler = () => {
    setPasswordReveal((p) => !p);
  };

  const revealInfoPanelClickHandler = () => {
    setInformationPanel((p) => !p);
  };

  return (
    <div className={styles.container}>
      <InputUx
        name={name}
        label={label}
        id={passwordId}
        defaultValue={defaultValue}
        rules={PASSWORD_STRENGTH_RULES}
        disabled={false}>
        <Input
          id={passwordId}
          type={passwordReveal ? 'text' : 'password'}
          rules={PASSWORD_STRENGTH_RULES}
          name={name}
          autoComplete="new-password"
          data-testid="password-strength-input"
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
        <span className={`${styles.result__meter} ${styles[`result__meter--${passwordScore}`]}`} />
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
      <output
        htmlFor={passwordId}
        data-testid="password-strength-status"
        aria-live="polite"
        className="invisibleAccessible">
        {screenReaderText(passwordScore)}
      </output>
    </div>
  );
}

// Type required for <Suspense> component; generics require it
export type InputPasswordStrength = typeof InputPasswordStrength;
export default InputPasswordStrength;
