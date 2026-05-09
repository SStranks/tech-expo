import type { SubmitHandler } from 'react-hook-form';

import { Navigate, useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';
import { updateStageThunk } from '@Features/scrumboard/redux/pipeline.thunks';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';
import { parseUUID } from '@Utils/routeParams';

import { stageSelectors } from '../../features/scrumboard/redux/pipeline.slice';

type FormFieldData = {
  stageTitle: string;
};

function PipelineStageUpdatePage(): React.JSX.Element {
  const { stageId: stageIdParam } = useParams();
  const stageId = parseUUID(stageIdParam);

  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const stage = useReduxSelector((state) => (stageId ? stageSelectors.selectById(state, stageId) : undefined));

  if (!stageId || !stage) return <Navigate to="/pipeline" replace />;

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  const onSubmit: SubmitHandler<FormFieldData> = async (data) => {
    await reduxDispatch(updateStageThunk({ id: stage.id, title: data.stageTitle }));
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
