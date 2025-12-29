import { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';
import { updateStage } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch } from '@Redux/hooks';

type FormFieldData = {
  stageTitle: string;
};

function PipelineStageUpdatePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [locationState] = useState(state);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit: SubmitHandler<FormFieldData> = (data) => {
    const { stageTitle } = data;
    const stageId = locationState.columnId;
    reduxDispatch(updateStage({ stageId, stageTitle }));
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
          <FormProvider.SubmitButton name="submit" />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PipelineStageUpdatePage;
