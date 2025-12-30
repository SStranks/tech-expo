import type { TValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import InputTimeField from '@Components/aria-inputs/time-field/InputTimeField';
import InputParser from '@Components/react-hook-form/InputParser';
import InputUx from '@Components/react-hook-form/InputUx';

interface Props {
  name: string;
  label: string;
  rules?: TValidationRules;
}

function FormProviderTimeField({ label, name, rules = {} }: Props): React.JSX.Element {
  const {
    control,
    formState: { defaultValues },
  } = useFormContext();
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { invalid: isInvalid } }) => (
        <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue} disabled={false}>
          <InputParser
            ReactAriaComponent={InputTimeField}
            value={value}
            onChange={onChange}
            {...{ id, name, 'aria-label': id, isInvalid, onBlur }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderTimeField;
