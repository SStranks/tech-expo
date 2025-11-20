import type { TValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import { InputNumber } from '@Components/aria-inputs';
import { InputParser, InputUx } from '@Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: TValidationRules;
}

function FormProviderNumber({ label, name, rules = {}, ...rest }: IProps): React.JSX.Element {
  const { control } = useFormContext();
  const { defaultValues } = useFormState({ name, control });
  const id = useId();

  const defaultValue = defaultValues?.[name];

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { invalid: isInvalid } }) => (
        <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue}>
          {' '}
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
