import type { SubmitHandler } from 'react-hook-form';

import { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';
import { makeSelectorStageById, updateStage } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';

type FormFieldData = {
  stageTitle: string;
};

function PipelineStageUpdatePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const { stageId } = useParams();
  const selectorStageById = useMemo(() => makeSelectorStageById(), []);
  const stage = useReduxSelector((state) => (stageId ? selectorStageById(state, stageId) : undefined));

  if (!stageId || !stage) return <Navigate to="/pipeline" replace />;

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  const onSubmit: SubmitHandler<FormFieldData> = (data) => {
    const { stageTitle } = data;
    reduxDispatch(updateStage({ stageId, stageTitle }));
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Edit Stage" />
        <FormModal.Content>
          <FormProvider.Input
            type="text"
            defaultValue={stage.title}
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
