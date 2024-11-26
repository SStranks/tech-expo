import { useId } from 'react';
import { InputProps } from 'react-aria-components';
import { type RegisterOptions, useFormContext } from 'react-hook-form';

import { Input, InputUx } from '@Components/react-hook-form';

interface IProps {
  name: string;
  type: React.HTMLInputTypeAttribute;
  label: string;
  rules?: RegisterOptions;
}
function FormProviderInput({ label, name, rules = {}, type, ...rest }: InputProps & IProps): JSX.Element {
  const {
    formState: { defaultValues, dirtyFields, errors, isSubmitted },
    getFieldState,
    register,
  } = useFormContext();
  const { invalid } = getFieldState(name);
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <InputUx
      id={id}
      label={label}
      error={errors[name as string]}
      defaultValue={defaultValue}
      isSubmitted={isSubmitted}
      isDirty={dirtyFields[name] || defaultValue}
      isRequired={rules?.required}
      invalid={invalid}>
      <Input
        register={{ ...register(name, rules) }}
        id={id}
        type={type}
        defaultValue={defaultValue}
        error={errors[name as string]}
        isRequired={rules?.required}
        {...rest}
      />
    </InputUx>
  );
}

export default FormProviderInput;
