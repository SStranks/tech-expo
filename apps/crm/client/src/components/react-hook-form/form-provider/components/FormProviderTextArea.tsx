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
    formState: { errors, isSubmitted },
  } = useFormContext();
  const { invalid, isDirty } = getFieldState(name);
  const id = useId();

  return (
    <InputUx
      id={id}
      label={label}
      error={errors[name as string]}
      isSubmitted={isSubmitted}
      isDirty={isDirty}
      invalid={invalid}
      isRequired={rules?.required}>
      <TextArea register={register} id={id} name={name} rules={rules} error={errors[name as string]} label={label} />
    </InputUx>
  );
}

export default FormProviderTextArea;
