import type { ComboBoxProps } from 'react-aria-components';
import type { FieldValues, Path } from 'react-hook-form';

import type { ValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import InputComboTag from '@Components/aria-inputs/comboTag/InputComboTag';
import InputParser from '@Components/react-hook-form/InputParser';
import InputUx from '@Components/react-hook-form/InputUx';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  listItems: { id: string; name: string }[];
  rules?: ValidationRules;
};

function FormProviderComboTag<T extends object, R extends FieldValues>({
  label,
  listItems,
  name,
  rules = {},
}: ComboBoxProps<T> & Props<R>): React.JSX.Element {
  const { control, trigger } = useFormContext<R>();
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
            ReactAriaComponent={InputComboTag}
            value={value}
            onChange={onChange}
            {...{ id, name, defaultValue, isInvalid, label, listItems, onBlur, trigger }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderComboTag;
