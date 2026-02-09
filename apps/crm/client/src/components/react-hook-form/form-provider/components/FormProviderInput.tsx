import type { InputHTMLAttributes } from 'react';
import type { InputProps } from 'react-aria-components';
import type { FieldValues, Path } from 'react-hook-form';

import type { ValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import Input from '@Components/react-hook-form/input/Input';
import InputUx from '@Components/react-hook-form/InputUx';

interface Props<T extends FieldValues> extends InputHTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  type: React.HTMLInputTypeAttribute;
  label: string;
  rules?: ValidationRules;
  autoComplete?: string;
}

function FormProviderInput<T extends FieldValues>({
  autoComplete,
  label,
  name,
  rules = {},
  type,
  ...rest
}: InputProps & Props<T>): React.JSX.Element {
  const { control } = useFormContext<T>();
  const { defaultValues } = useFormState<T>({ name, control });
  const id = useId();

  const rawDefaultValue = defaultValues?.[name];
  const defaultValue = typeof rawDefaultValue === 'string' ? rawDefaultValue : '';

  return (
    <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue} disabled={false}>
      <Input
        id={id}
        type={type}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        {...rest}
      />
    </InputUx>
  );
}

export default FormProviderInput;
