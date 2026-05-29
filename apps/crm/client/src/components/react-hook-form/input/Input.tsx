import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

import type { ValidationRules } from '../validationRules';

import { useEffect } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import styles from './Input.module.scss';

interface Props<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  name: Path<T>;
  rules: ValidationRules;
  type: HTMLInputTypeAttribute;
  autoComplete?: HTMLInputAutoCompleteAttribute;
}

function Input<T extends FieldValues>(props: Props<T>): React.JSX.Element {
  const { id, name, rules, type, ...rest } = props;
  const { control, formState, getFieldState, register, trigger } = useFormContext<T>();
  const { defaultValues } = useFormState<T>({ name, control });
  const { error } = getFieldState(name, formState);

  const rawDefaultValue = defaultValues?.[name];
  const defaultValue = typeof rawDefaultValue === 'string' ? rawDefaultValue : '';

  useEffect(() => {
    if (defaultValue) void trigger(name);
  }, [defaultValue, name, trigger]);

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <input
      {...register(name, { ...rules })}
      {...rest}
      type={type}
      id={id}
      className={styles.input}
      defaultValue={defaultValue}
      placeholder=""
      aria-invalid={error ? true : false}
      aria-required={!!rules.required}
    />
  );
}

export default Input;
