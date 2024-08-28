import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormModal from '#Components/modal/FormModal';
import { GENERIC_TEXT_RULES } from '#Components/react-hook-form/validationRules';
import { FormProvider } from '#Components/react-hook-form';
import { useReduxDispatch } from '#Redux/hooks';
import { createStage } from '#Features/scrumboard/redux/pipelineSlice';
import { SubmitHandler } from 'react-hook-form';

type IFormData = {
  title: string;
};

function PipelineStageCreatePage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    setPortalActiveInternal(true);
  }, [setPortalActiveInternal]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit: SubmitHandler<IFormData> = (data) => {
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
          <FormProvider.SubmitButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PipelineStageCreatePage;