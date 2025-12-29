import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';
import { createStage } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch } from '@Redux/hooks';

type FormFieldData = {
  title: string;
};

function PipelineStageCreatePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit: SubmitHandler<FormFieldData> = (data) => {
    reduxDispatch(createStage({ title: data.title }));
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Create New Stage" />
        <FormModal.Content>
          <FormProvider.Input type="text" rules={GENERIC_TEXT_RULES} name="title" label="Stage Title" />
        </FormModal.Content>
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormProvider.SubmitButton name="submit" />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PipelineStageCreatePage;
