import type { HTMLInputAutoCompleteAttribute, HTMLInputTypeAttribute, InputHTMLAttributes } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

import type { ValidationRules } from '../validationRules';

import { useEffect } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import styles from './Input.module.scss';

interface Props<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  type: HTMLInputTypeAttribute;
  id: string;
  name: Path<T>;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  rules: ValidationRules;
}

function Input<T extends FieldValues>(props: Props<T>): React.JSX.Element {
  const { id, name, rules, type, ...rest } = props;
  const { control, register, trigger } = useFormContext<T>();
  const { defaultValues, errors } = useFormState<T>({ name, control });

  const rawDefaultValue = defaultValues?.[name];
  const defaultValue = typeof rawDefaultValue === 'string' ? rawDefaultValue : '';
  const error = errors[name];

  useEffect(() => {
    if (defaultValue) void trigger(name);
  }, [defaultValue, name, trigger]);

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <input
      {...register(name, { ...rules, onChange: () => void trigger(name) })}
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
