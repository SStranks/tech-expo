import type { TValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import { InputTagGroup } from '@Components/aria-inputs';
import { InputParser, InputUx } from '@Components/react-hook-form';

interface IProps {
  name: string;
  label: string;
  rules?: TValidationRules;
}

function FormProviderTagGroup({ label, name, rules = {} }: IProps): React.JSX.Element {
  const { control, trigger } = useFormContext();
  const { defaultValues } = useFormState({ name, control });
  const id = useId();

  const defaultValue = defaultValues?.[name];
  const validateFn = rules?.required
    ? (v: any) => (Array.isArray(v) && v.length > 0) || 'This field is required'
    : undefined;
  const mergedRules = {
    ...rules,
    validate: validateFn,
  };

  // if (rules.required) rules.validate = (v) => v.length > 0;

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      rules={mergedRules}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { invalid: isInvalid } }) => (
        <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue}>
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
