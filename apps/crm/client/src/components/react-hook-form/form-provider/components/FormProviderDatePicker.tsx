import { useId } from 'react';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';

import { InputDatePicker } from '@Components/aria-inputs';
import { InputParser, InputUx } from '@Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

function FormProviderDatePicker({ label, name, rules = {} }: IProps): JSX.Element {
  const {
    control,
    formState: { defaultValues, dirtyFields, isSubmitted },
  } = useFormContext();
  const id = useId();

  const defaultValue = defaultValues?.[name];
  // const placeholder = today(getLocalTimeZone());

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { error, invalid: isInvalid } }) => (
        <InputUx
          id={id}
          label={label}
          defaultValue={defaultValue}
          error={error}
          isSubmitted={isSubmitted}
          invalid={isInvalid}
          isDirty={dirtyFields[name] || defaultValue}
          isRequired={rules?.required}>
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
