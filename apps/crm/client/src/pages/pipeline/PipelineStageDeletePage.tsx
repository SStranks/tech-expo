import type { SubmitHandler } from 'react-hook-form';

import { Navigate, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { deleteStageThunk } from '@Features/scrumboard/redux/pipeline.thunks';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';
import { parseUUID } from '@Utils/routeParams';

import { stageSelectors } from '../../features/scrumboard/redux/pipeline.slice';

import ScrumboardColumnStyles from '@Features/scrumboard/ScrumboardColumn.module.scss';

function PiplineStageDeletePage(): React.JSX.Element {
  const { stageId: stageIdParam } = useParams({ from: '/pipeline/stage/delete/$stageId' });
  const stageId = parseUUID(stageIdParam);

  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const stage = useReduxSelector((state) => (stageId ? stageSelectors.selectById(state, stageId) : undefined));

  useEffect(() => {
    const column = document.querySelector(`[data-rbd-droppable-id="${stageId}"]`);
    column?.classList.add(ScrumboardColumnStyles.dangerColumn);

    return () => column?.classList.remove(ScrumboardColumnStyles.dangerColumn);
  }, [stageId]);

  if (!stage) return <Navigate to="/pipeline" replace />;

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate({ to: '/pipeline' });
  };

  const onSubmit: SubmitHandler<Record<string, never>> = async () => {
    await reduxDispatch(deleteStageThunk({ id: stageId }));
    setPortalActiveInternal(false);
    void navigate({ to: '/pipeline' });
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
