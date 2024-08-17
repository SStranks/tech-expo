import { useId } from 'react';
import { useFormContext, type RegisterOptions } from 'react-hook-form';
import { InputUx, Input } from '#Components/react-hook-form';

interface IProps {
  name: string;
  type: React.HTMLInputTypeAttribute;
  label: string;
  defaultValue?: string;
  rules?: RegisterOptions;
}
function FormProviderInput({ name, type, label, defaultValue, rules = {} }: IProps): JSX.Element {
  const {
    register,
    formState: { errors, isSubmitted, dirtyFields },
    getFieldState,
  } = useFormContext();
  const { invalid } = getFieldState(name);
  const id = useId();

  return (
    <InputUx
      id={id}
      label={label}
      error={errors[name as string]}
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
      />
    </InputUx>
  );
}

export default FormProviderInput;
