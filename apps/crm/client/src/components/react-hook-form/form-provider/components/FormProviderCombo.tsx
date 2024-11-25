import type { ComboBoxProps } from 'react-aria-components';

import { useId } from 'react';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';

import { InputCombo } from '#Components/aria-inputs';
import { InputParser, InputUx } from '#Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  defaultInputValue?: string;
  // items: { name: string }[];
  rules?: RegisterOptions;
}

function FormProviderCombo<T extends object>({
  name,
  defaultInputValue,
  items,
  label,
  rules = {},
  ...rest
}: ComboBoxProps<T> & IProps): JSX.Element {
  const {
    control,
    formState: { defaultValues, dirtyFields, isSubmitted },
  } = useFormContext();
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultInputValue}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { error, invalid: isInvalid } }) => (
        <InputUx
          id={id}
          label={label}
          error={error}
          defaultValue={defaultValue}
          isSubmitted={isSubmitted}
          isDirty={dirtyFields[name] || defaultValue}
          invalid={isInvalid}
          isRequired={rules?.required}>
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
