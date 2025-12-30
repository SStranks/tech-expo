import type { ComboBoxProps } from 'react-aria-components';

import type { ValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import InputCombo from '@Components/aria-inputs/combo/InputCombo';
import InputParser from '@Components/react-hook-form/InputParser';
import InputUx from '@Components/react-hook-form/InputUx';

type Props = {
  name: string;
  label: string;
  defaultInputValue?: string;
  // items: { name: string }[];
  rules?: ValidationRules;
};

function FormProviderCombo<T extends object>({
  defaultInputValue,
  items,
  label,
  name,
  rules = {},
  ...rest
}: ComboBoxProps<T> & Props): React.JSX.Element {
  const { control } = useFormContext();
  const { defaultValues } = useFormState({ name, control });
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultInputValue}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { invalid: isInvalid } }) => (
        <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue} disabled={false}>
          <InputParser
            ReactAriaComponent={InputCombo}
            value={value}
            onChange={onChange}
            {...{ id, name, defaultValue, isInvalid, items, label, onBlur, ...rest }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderCombo;
