import { useFormContext } from 'react-hook-form';

import { ButtonSave } from '@Components/buttons';

function FormProviderSubmitButton(): React.JSX.Element {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  // TODO: OnClick needs to trigger submit
  return <ButtonSave onClick={() => null} disabled={isSubmitting} />;
}

export default FormProviderSubmitButton;
