import { useFormContext } from 'react-hook-form';

import { ButtonSave } from '#Components/buttons';

function FormProviderSubmitButton(): JSX.Element {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return <ButtonSave disabled={isSubmitting} />;
}

export default FormProviderSubmitButton;
