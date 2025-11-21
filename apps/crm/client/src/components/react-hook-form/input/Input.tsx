import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';

import type { TValidationRules } from '../validationRules';

import { useFormContext, useFormState } from 'react-hook-form';

import styles from './Input.module.scss';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  type: HTMLInputTypeAttribute;
  id: string;
  name: string;
  autoComplete: HTMLInputAutoCompleteAttribute;
  rules: TValidationRules;
}

function Input(props: IProps): React.JSX.Element {
  const { id, name, rules, type, ...rest } = props;
  const { control, register, trigger } = useFormContext();
  const { defaultValues, errors } = useFormState({ name, control });

  // const { mode } = control._options;
  const defaultValue = defaultValues?.[name];
  const error = errors?.[name];

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
      aria-describedby={`${id}-error`}
    />
  );
}

export default Input;
