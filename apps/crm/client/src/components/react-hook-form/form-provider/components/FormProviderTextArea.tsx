import type { TValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import InputUx from '@Components/react-hook-form/InputUx';
import TextArea from '@Components/react-hook-form/textarea/TextArea';

type Props = {
  name: string;
  label: string;
  rules?: TValidationRules;
};
function FormProviderTextArea({ label, name, rules = {} }: Props): React.JSX.Element {
  const { control } = useFormContext();
  const { defaultValues } = useFormState({ name, control });
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue} disabled={false}>
      <TextArea id={id} name={name} rules={rules} defaultValue={defaultValue} />
    </InputUx>
  );
}

export default FormProviderTextArea;
