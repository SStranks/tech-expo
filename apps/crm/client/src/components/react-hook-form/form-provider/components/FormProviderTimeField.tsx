import { useId } from 'react';
import { Controller, useFormContext, type RegisterOptions } from 'react-hook-form';
import { InputTimeField } from '#Components/aria-inputs';
import { InputParser, InputUx } from '#Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

function FormProviderTimeField({ name, label, rules = {} }: IProps): JSX.Element {
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
          invalid={isInvalid}
          isDirty={dirtyFields[name] || defaultValue}
          isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputTimeField}
            value={value}
            onChange={onChange}
            {...{ name, id, 'aria-label': id, onBlur, isInvalid }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderTimeField;
