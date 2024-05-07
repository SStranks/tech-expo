import { useId } from 'react';
import { Controller, useFormContext, type RegisterOptions } from 'react-hook-form';
import { InputTagGroup } from '#Components/aria-inputs';
import { InputParser, InputUx } from '#Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

function FormProviderTagGroup({ name, label, rules = {} }: IProps): JSX.Element {
  const {
    control,
    trigger,
    formState: { defaultValues, isSubmitted },
  } = useFormContext();
  const id = useId();

  const defaultValue = defaultValues?.[name];
  console.log('FORMMODAL, defaultValue', defaultValue);
  if (rules.required) rules.validate = (v) => v.length > 0;

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
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
            ReactAriaComponent={InputTagGroup}
            value={value}
            onChange={onChange}
            {...{ name, id, label, onBlur, isInvalid, defaultValue, trigger }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderTagGroup;
