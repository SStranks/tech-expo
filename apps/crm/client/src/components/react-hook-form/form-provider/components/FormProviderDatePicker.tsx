import type { TValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import InputDatePicker from '@Components/aria-inputs/date-picker/InputDatePicker';
import InputParser from '@Components/react-hook-form/InputParser';
import InputUx from '@Components/react-hook-form/InputUx';

type Props = {
  name: string;
  label: string;
  rules?: TValidationRules;
};

function FormProviderDatePicker({ label, name, rules = {} }: Props): React.JSX.Element {
  const { control } = useFormContext();
  const { defaultValues } = useFormState({ name, control });
  const id = useId();

  const defaultValue = defaultValues?.[name];
  // const placeholder = today(getLocalTimeZone());

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { invalid: isInvalid } }) => (
        <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue} disabled={false}>
          <InputParser
            ReactAriaComponent={InputDatePicker}
            value={value}
            onChange={onChange}
            {...{ id, name, 'aria-label': id, isInvalid, onBlur }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderDatePicker;
