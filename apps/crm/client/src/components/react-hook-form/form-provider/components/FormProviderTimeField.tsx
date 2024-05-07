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
    formState: { isSubmitted },
  } = useFormContext();
  const id = useId();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, value, onChange, onBlur }, fieldState: { invalid: isInvalid, error, isDirty } }) => (
        <InputUx
          id={id}
          label={label}
          error={error}
          isSubmitted={isSubmitted}
          invalid={isInvalid}
          isDirty={isDirty}
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
