import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';

import type { ValidationRules } from '../validationRules';

import { useEffect } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import styles from './Input.module.scss';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  type: HTMLInputTypeAttribute;
  id: string;
  name: string;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  rules: ValidationRules;
}

function Input(props: Props): React.JSX.Element {
  const { id, name, rules, type, ...rest } = props;
  const { control, register, trigger } = useFormContext();
  const { defaultValues, errors } = useFormState({ name, control });

  // const { mode } = control._options;
  const defaultValue = defaultValues?.[name];
  const error = errors?.[name];

  useEffect(() => {
    if (defaultValue) trigger(name);
  }, [defaultValue, name, trigger]);

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <input
      {...register(name, { ...rules, onChange: () => trigger(name) })}
      {...rest}
      type={type}
      id={id}
      className={styles.input}
      defaultValue={defaultValue}
      placeholder=""
      aria-invalid={error ? true : false}
      aria-required={!!rules?.required}
    />
  );
}

export default Input;
