import type { ComboBoxProps } from 'react-aria-components';

import type { TValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import { InputComboTag } from '@Components/aria-inputs';
import { InputParser, InputUx } from '@Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  listItems: { id: string; name: string }[];
  rules?: TValidationRules;
}

function FormProviderComboTag<T extends object>({
  label,
  listItems,
  name,
  rules = {},
}: ComboBoxProps<T> & IProps): React.JSX.Element {
  const { control, trigger } = useFormContext();
  const { defaultValues } = useFormState({ name, control });
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { invalid: isInvalid } }) => (
        <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue}>
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
