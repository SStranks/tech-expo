import type { InputHTMLAttributes } from 'react';

import type { TValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { InputProps } from 'react-aria-components';
import { useFormContext, useFormState } from 'react-hook-form';

import Input from '@Components/react-hook-form/input/Input';
import InputUx from '@Components/react-hook-form/InputUx';

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  type: React.HTMLInputTypeAttribute;
  label: string;
  rules?: TValidationRules;
  autoComplete: string;
}

function FormProviderInput({
  autoComplete,
  label,
  name,
  rules = {},
  type,
  ...rest
}: InputProps & IProps): React.JSX.Element {
  const { control } = useFormContext();
  const { defaultValues } = useFormState({ name, control });
  const id = useId();

  const defaultValue = defaultValues?.[name];

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
