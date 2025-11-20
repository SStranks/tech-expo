import type { TValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import { InputUx, TextArea } from '@Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: TValidationRules;
}
function FormProviderTextArea({ label, name, rules = {} }: IProps): React.JSX.Element {
  const { control } = useFormContext();
  const { defaultValues } = useFormState({ name, control });
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue}>
      <TextArea id={id} name={name} rules={rules} defaultValue={defaultValue} />
    </InputUx>
  );
}

export default FormProviderTextArea;
