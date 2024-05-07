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

function FormProviderSelect({ name, label, items, rules = {} }: IProps): JSX.Element {
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
      render={({ field: { name, value, onChange, onBlur }, fieldState: { isDirty, invalid: isInvalid, error } }) => (
        <InputUx
          id={id}
          label={label}
          error={error}
          isSubmitted={isSubmitted}
          isDirty={isDirty}
          invalid={isInvalid}
          isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputSelect}
            value={value}
            onChange={onChange}
            {...{ name, id, 'aria-label': label, items, onBlur, isInvalid }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderSelect;
