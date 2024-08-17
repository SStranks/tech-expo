import type { ComboBoxProps } from 'react-aria-components';
import { useId } from 'react';
import { type RegisterOptions, useFormContext, Controller } from 'react-hook-form';
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
  label,
  defaultInputValue,
  items,
  rules = {},
  ...rest
}: ComboBoxProps<T> & IProps): JSX.Element {
  const {
    control,
    formState: { defaultValues, isSubmitted, dirtyFields },
  } = useFormContext();
  const id = useId();

  const defaultValue = defaultValues?.[name];
  // if (name === 'companyTitle') console.log(dirtyFields, name, defaultValues);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultInputValue}
      render={({ field: { name, value, onChange, onBlur }, fieldState: { invalid: isInvalid, error } }) => (
        <InputUx
          id={id}
          label={label}
          error={error}
          isSubmitted={isSubmitted}
          isDirty={dirtyFields[name] || defaultValue}
          invalid={isInvalid}
          isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputCombo}
            value={value}
            onChange={onChange}
            {...{ name, id, label, items, onBlur, defaultValue, isInvalid, ...rest }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderCombo;
