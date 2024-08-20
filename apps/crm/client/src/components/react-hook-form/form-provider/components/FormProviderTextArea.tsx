import { useId } from 'react';
import { useFormContext, type RegisterOptions } from 'react-hook-form';
import { InputUx, TextArea } from '#Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
}
function FormProviderTextArea({ name, label, rules = {} }: IProps): JSX.Element {
  const {
    register,
    getFieldState,
    formState: { defaultValues, errors, isSubmitted, dirtyFields },
  } = useFormContext();
  const { invalid } = getFieldState(name);
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <InputUx
      id={id}
      label={label}
      defaultValue={defaultValue}
      error={errors[name as string]}
      isSubmitted={isSubmitted}
      isDirty={dirtyFields[name] || defaultValue}
      invalid={invalid}
      isRequired={rules?.required}>
      <TextArea register={register} id={id} name={name} rules={rules} error={errors[name as string]} label={label} />
    </InputUx>
  );
}

export default FormProviderTextArea;
