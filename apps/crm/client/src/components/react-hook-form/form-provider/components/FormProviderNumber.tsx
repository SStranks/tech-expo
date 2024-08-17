import type { NumberFieldProps } from 'react-aria-components';
import { useId } from 'react';
import { Controller, useFormContext, type RegisterOptions } from 'react-hook-form';
import { InputNumber } from '#Components/aria-inputs';
import { InputParser, InputUx } from '#Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

function FormProviderNumber({ name, label, rules = {}, ...rest }: NumberFieldProps & IProps): JSX.Element {
  const {
    control,
    formState: { defaultValues, isSubmitted },
  } = useFormContext();
  const id = useId();

  const defaultValue = defaultValues?.[name];

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
          isDirty={isDirty || defaultValue}
          isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputNumber}
            value={value}
            onChange={onChange}
            {...{ name, id, 'aria-label': label, onBlur, isInvalid, ...rest }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderNumber;
