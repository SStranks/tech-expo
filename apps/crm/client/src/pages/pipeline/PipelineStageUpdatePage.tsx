import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FormModal from '#Components/modal/FormModal';
import { GENERIC_TEXT_RULES } from '#Components/react-hook-form/validationRules';
import { FormProvider } from '#Components/react-hook-form';
import { useReduxDispatch } from '#Redux/hooks';
import { updateStage } from '#Features/scrumboard/redux/pipelineSlice';
import { SubmitHandler } from 'react-hook-form';

type IFormData = {
  stageTitle: string;
};

function PipelineStageUpdatePage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [locationState] = useState(state);

  useEffect(() => {
    setPortalActiveInternal(true);
  }, [setPortalActiveInternal]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit: SubmitHandler<IFormData> = (data) => {
    const { stageTitle } = data;
    const columnId = locationState.columnId;
    reduxDispatch(updateStage({ columnId, stageTitle }));
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Edit Stage" />
        <FormModal.Content>
          <FormProvider.Input
            type="text"
            defaultValue={locationState.columnTitle}
            rules={GENERIC_TEXT_RULES}
            name="stageTitle"
            label="Stage Title"
          />
        </FormModal.Content>
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormProvider.SubmitButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PipelineStageUpdatePage;
