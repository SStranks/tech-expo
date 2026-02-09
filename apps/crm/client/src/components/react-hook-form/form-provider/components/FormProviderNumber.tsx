import type { FieldValues, Path } from 'react-hook-form';

import type { ValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import InputNumber from '@Components/aria-inputs/number/InputNumber';
import InputParser from '@Components/react-hook-form/InputParser';
import InputUx from '@Components/react-hook-form/InputUx';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  rules?: ValidationRules;
};

function FormProviderNumber<T extends FieldValues>({ label, name, rules = {}, ...rest }: Props<T>): React.JSX.Element {
  const { control } = useFormContext<T>();
  const { defaultValues } = useFormState<T>({ name, control });
  const id = useId();

  const rawDefaultValue = defaultValues?.[name];
  const defaultValue = typeof rawDefaultValue === 'string' ? rawDefaultValue : '';

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { invalid: isInvalid } }) => (
        <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue} disabled={false}>
          {' '}
          <InputParser
            ReactAriaComponent={InputNumber}
            value={value}
            onChange={onChange}
            {...{ id, name, 'aria-label': label, isInvalid, onBlur, ...rest }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderNumber;
