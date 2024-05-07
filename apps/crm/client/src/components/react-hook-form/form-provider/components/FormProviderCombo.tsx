import { useId } from 'react';
import { type RegisterOptions, useFormContext, Controller } from 'react-hook-form';
import { InputCombo } from '#Components/aria-inputs';
import { InputParser, InputUx } from '#Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  items: { name: string }[];
  rules?: RegisterOptions;
}

function FormProviderCombo({ name, label, items, rules = {} }: IProps): JSX.Element {
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
      render={({ field: { name, value, onChange, onBlur }, fieldState: { invalid: isInvalid, isDirty, error } }) => (
        <InputUx
          id={id}
          label={label}
          error={error}
          isSubmitted={isSubmitted}
          isDirty={isDirty}
          invalid={isInvalid}
          isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputCombo}
            value={value}
            onChange={onChange}
            {...{ name, id, label, items, onBlur, defaultValue, isInvalid }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderCombo;
