import { useId } from 'react';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';

import { InputTimeField } from '@Components/aria-inputs';
import { InputParser, InputUx } from '@Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

function FormProviderTimeField({ label, name, rules = {} }: IProps): React.JSX.Element {
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
          defaultValue={defaultValue}
          error={error}
          isSubmitted={isSubmitted}
          invalid={isInvalid}
          isDirty={dirtyFields[name] || defaultValue}
          isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputTimeField}
            value={value}
            onChange={onChange}
            {...{ id, name, 'aria-label': id, isInvalid, onBlur }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderTimeField;
