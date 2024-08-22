import type { SelectProps } from 'react-aria-components';
import { useId } from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';
import { InputSelect } from '#Components/aria-inputs';
import { InputParser, InputUx } from '#Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  items: { name: string }[];
  rules?: RegisterOptions;
}

function FormProviderSelect<T extends object>({
  name,
  label,
  items,
  rules = {},
  ...rest
}: SelectProps<T> & IProps): JSX.Element {
  const {
    control,
    formState: { defaultValues, isSubmitted, dirtyFields },
  } = useFormContext();
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, value, onChange, onBlur }, fieldState: { invalid: isInvalid, error } }) => (
        <InputUx
          id={id}
          label={label}
          defaultValue={defaultValue}
          error={error}
          isSubmitted={isSubmitted}
          isDirty={dirtyFields[name] || defaultValue}
          invalid={isInvalid}
          isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputSelect}
            value={value}
            onChange={onChange}
            {...{ name, id, 'aria-label': label, items, onBlur, isInvalid, ...rest }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderSelect;
