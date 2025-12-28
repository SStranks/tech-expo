import type { InputHTMLAttributes } from 'react';

import { useFormContext, useFormState } from 'react-hook-form';

import ButtonSave from '@Components/buttons/ButtonSave';

interface IProps extends InputHTMLAttributes<HTMLButtonElement> {
  name: string;
}

function FormProviderSubmitButton({ name, ...rest }: IProps): React.JSX.Element {
  const { control } = useFormContext();
  const { isSubmitting } = useFormState({ name, control });

  // TODO: OnClick needs to trigger submit
  return <ButtonSave {...rest} name={name} onClick={() => null} disabled={isSubmitting} />;
}

export default FormProviderSubmitButton;
