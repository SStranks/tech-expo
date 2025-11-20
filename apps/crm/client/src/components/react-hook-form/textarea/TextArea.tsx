import type { TValidationRules } from '../validationRules';

import { ChangeEvent, InputHTMLAttributes } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import styles from './TextArea.module.scss';

// Automatically resizes textarea dependent on user input
const autoHeightResize = (e: ChangeEvent<HTMLTextAreaElement>) => {
  e.target.style.height = 'auto';
  e.target.style.height = e.target.scrollHeight + 'px';
};

interface IProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  name: string;
  rules?: TValidationRules;
}

function TextArea(props: IProps): React.JSX.Element {
  const { id, name, rules, ...rest } = props;
  const { control, register, trigger } = useFormContext();
  const { defaultValues, errors } = useFormState({ name, control });

  const defaultValue = defaultValues?.[name];
  const error = errors?.[name];

  // NOTE:  Placeholder intentionally empty; style using :placeholder-shown
  return (
    <textarea
      {...register(name, {
        ...rules,
        onChange: (e) => {
          autoHeightResize(e);
          trigger(name);
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
