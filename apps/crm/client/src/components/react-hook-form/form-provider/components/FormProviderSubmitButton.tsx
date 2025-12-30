import type { InputHTMLAttributes } from 'react';

import { useFormContext, useFormState } from 'react-hook-form';

import ButtonSave from '@Components/buttons/ButtonSave';

interface Props extends InputHTMLAttributes<HTMLButtonElement> {
  name: string;
}

function FormProviderSubmitButton({ name, ...rest }: Props): React.JSX.Element {
  const { control } = useFormContext();
  const { isSubmitting } = useFormState({ name, control });

  // TODO: OnClick needs to trigger submit
  return <ButtonSave {...rest} name={name} onClick={() => null} disabled={isSubmitting} />;
}

export default FormProviderSubmitButton;
