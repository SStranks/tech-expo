import type { FieldValues, Path } from 'react-hook-form';

import type { ValidationRules } from '@Components/react-hook-form/validationRules';

import { useId } from 'react';
import { Controller, useFormContext, useFormState } from 'react-hook-form';

import InputTagGroup from '@Components/aria-inputs/tagGroup/InputTagGroup';
import InputParser from '@Components/react-hook-form/InputParser';
import InputUx from '@Components/react-hook-form/InputUx';

type Props<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  rules?: ValidationRules;
};

function FormProviderTagGroup<T extends FieldValues>({ label, name, rules }: Props<T>): React.JSX.Element {
  const { control, trigger } = useFormContext<T>();
  const { defaultValues } = useFormState<T>({ name, control });
  const id = useId();

  const rawDefaultValue = defaultValues?.[name];
  const defaultValue = typeof rawDefaultValue === 'string' ? rawDefaultValue : '';

  const validateFn = rules?.required
    ? (v: unknown) => (Array.isArray(v) && v.length > 0) || 'This field is required'
    : undefined;
  const mergedRules = {
    ...rules,
    validate: validateFn,
  };

  // if (rules.required) rules.validate = (v) => v.length > 0;

  return (
    <Controller
      control={control}
      name={name}
      rules={mergedRules}
      render={({ field: { name, onBlur, onChange, value }, fieldState: { invalid: isInvalid } }) => (
        <InputUx id={id} label={label} name={name} rules={rules} defaultValue={defaultValue} disabled={false}>
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
