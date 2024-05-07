import { ButtonSave } from '#Components/buttons';
import { useFormContext } from 'react-hook-form';

function FormProviderSubmitButton(): JSX.Element {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return <ButtonSave disabled={isSubmitting} />;
}

export default FormProviderSubmitButton;
