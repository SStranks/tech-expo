import type { FieldValues, Path } from 'react-hook-form';

import type { ValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import InputUx from '@Components/react-hook-form/InputUx';
import TextArea from '@Components/react-hook-form/textarea/TextArea';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  rules?: ValidationRules;
};
function FormProviderTextArea<T extends FieldValues>({ label, name, rules = {} }: Props<T>): React.JSX.Element {
  const { control } = useFormContext<T>();
  const { defaultValues } = useFormState<T>({ name, control });
  const id = useId();

  const rawDefaultValue = defaultValues?.[name];
  const defaultValue = typeof rawDefaultValue === 'string' ? rawDefaultValue : '';

  return (
    <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue} disabled={false}>
      <TextArea id={id} name={name} rules={rules} defaultValue={defaultValue} />
    </InputUx>
  );
}

export default FormProviderTextArea;
