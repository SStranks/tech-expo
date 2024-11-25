import { useId } from 'react';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';

import { InputNumber } from '#Components/aria-inputs';
import { InputParser, InputUx } from '#Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

function FormProviderNumber({ name, label, rules = {}, ...rest }: IProps): JSX.Element {
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
      render={({ field: { name, onBlur, onChange, value }, fieldState: { error, invalid: isInvalid } }) => (
        <InputUx
          id={id}
          label={label}
          error={error}
          defaultValue={defaultValue}
          isSubmitted={isSubmitted}
          invalid={isInvalid}
          isDirty={dirtyFields[name] || defaultValue}
          isRequired={rules?.required}>
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
