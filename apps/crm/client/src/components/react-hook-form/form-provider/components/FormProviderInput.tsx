import { useId } from 'react';
import { useFormContext, type RegisterOptions } from 'react-hook-form';
import { InputUx, Input } from '#Components/react-hook-form';
import { InputProps } from 'react-aria-components';

interface IProps {
  name: string;
  type: React.HTMLInputTypeAttribute;
  label: string;
  rules?: RegisterOptions;
}
function FormProviderInput({ name, type, label, rules = {}, ...rest }: InputProps & IProps): JSX.Element {
  const {
    register,
    formState: { errors, defaultValues, isSubmitted, dirtyFields },
    getFieldState,
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
