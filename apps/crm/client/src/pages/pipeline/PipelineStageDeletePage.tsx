import type { SubmitHandler } from 'react-hook-form';

import { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { deleteStage, makeSelectorStageById } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';

import ScrumboardColumnStyles from '@Features/scrumboard/ScrumboardColumn.module.scss';

function PiplineStageDeletePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const { stageId } = useParams();
  const selectorStageById = useMemo(() => makeSelectorStageById(), []);
  const stage = useReduxSelector((state) => (stageId ? selectorStageById(state, stageId) : undefined));

  useEffect(() => {
    if (!stageId) return;
    const column = document.querySelector(`[data-rbd-droppable-id="${stageId}"]`);
    column?.classList.add(ScrumboardColumnStyles.dangerColumn);

    return () => column?.classList.remove(ScrumboardColumnStyles.dangerColumn);
  }, [stageId]);

  if (!stage || !stageId) return <Navigate to="/pipeline" replace />;

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  const onSubmit: SubmitHandler<Record<string, never>> = () => {
    reduxDispatch(deleteStage({ stageId }));
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title={`Delete Stage: ${stage.title}`} />
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormModal.DeleteButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PiplineStageDeletePage;
