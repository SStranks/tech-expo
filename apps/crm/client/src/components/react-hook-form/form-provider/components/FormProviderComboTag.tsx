import { useId } from 'react';
import { Controller, useFormContext, type RegisterOptions } from 'react-hook-form';
import { InputComboTag } from '#Components/aria-inputs';
import { InputParser, InputUx } from '#Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  listItems: { id: string; name: string }[];
  rules?: RegisterOptions;
}

function FormProviderComboTag({ name, label, listItems, rules = {} }: IProps): JSX.Element {
  const {
    control,
    trigger,
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
          invalid={isInvalid}
          isDirty={isDirty}
          isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputComboTag}
            value={value}
            onChange={onChange}
            {...{ name, id, label, listItems, onBlur, defaultValue, isInvalid, trigger }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderComboTag;
