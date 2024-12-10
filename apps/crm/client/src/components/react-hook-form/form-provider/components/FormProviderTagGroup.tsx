import { useId } from 'react';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';

import { InputTagGroup } from '@Components/aria-inputs';
import { InputParser, InputUx } from '@Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

function FormProviderTagGroup({ label, name, rules = {} }: IProps): React.JSX.Element {
  const {
    control,
    formState: { defaultValues, dirtyFields, isSubmitted },
    trigger,
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
      render={({ field: { name, onBlur, onChange, value }, fieldState: { error, invalid: isInvalid } }) => (
        <InputUx
          id={id}
          label={label}
          defaultValue={defaultValue}
          error={error}
          isSubmitted={isSubmitted}
          isDirty={dirtyFields[name] || defaultValue}
          invalid={isInvalid}
          isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputTagGroup}
            value={value}
            onChange={onChange}
            {...{ id, name, defaultValue, isInvalid, label, onBlur, trigger }}
          />
        </InputUx>
      )}
    />
  );
}

export default FormProviderTagGroup;
