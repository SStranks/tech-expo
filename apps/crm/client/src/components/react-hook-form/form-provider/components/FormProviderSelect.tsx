import type { SelectProps } from 'react-aria-components';
import type { FieldValues, Path } from 'react-hook-form';

import type { ValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import InputSelect from '@Components/aria-inputs/select/InputSelect';
import InputParser from '@Components/react-hook-form/InputParser';
import InputUx from '@Components/react-hook-form/InputUx';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  items: { name: string }[];
  rules?: ValidationRules;
};

function FormProviderSelect<T extends object, R extends FieldValues>({
  items,
  label,
  name,
  rules = {},
  ...rest
}: SelectProps<T> & Props<R>): React.JSX.Element {
  const { control } = useFormContext<R>();
  const { defaultValues } = useFormState<R>({ name, control });
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
          <InputParser
            ReactAriaComponent={InputSelect}
            value={value}
            onChange={onChange}
            {...{ id, name, 'aria-label': label, isInvalid, items, onBlur, ...rest }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderSelect;
