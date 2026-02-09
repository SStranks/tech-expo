import type { ChangeEvent, InputHTMLAttributes } from 'react';
import type { FieldValues, Path } from 'react-hook-form';

import type { ValidationRules } from '../validationRules';

import { useFormContext, useFormState } from 'react-hook-form';

import styles from './TextArea.module.scss';

// Automatically resizes textarea dependent on user input
const autoHeightResize = (e: ChangeEvent<HTMLTextAreaElement>) => {
  e.target.style.height = 'auto';
  e.target.style.height = e.target.scrollHeight + 'px';
};

interface Props<T extends FieldValues> extends InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: Path<T>;
  rules?: ValidationRules;
}

function TextArea<T extends FieldValues>(props: Props<T>): React.JSX.Element {
  const { id, name, rules, ...rest } = props;
  const { control, register, trigger } = useFormContext<T>();
  const { defaultValues, errors } = useFormState<T>({ name, control });

  const rawDefaultValue = defaultValues?.[name];
  const defaultValue = typeof rawDefaultValue === 'string' ? rawDefaultValue : '';
  const error = errors[name];

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <textarea
      {...register(name, {
        ...rules,
        onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
          autoHeightResize(e);
          void trigger(name);
        },
      })}
      {...rest}
      id={id}
      className={styles.textarea}
      defaultValue={defaultValue}
      placeholder=""
      aria-describedby={`${id}-error`}
      aria-invalid={error ? true : false}
      aria-required={!!rules?.required}
    />
  );
}

export default TextArea;
