import type { SubmitHandler } from 'react-hook-form';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { deleteStage } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch } from '@Redux/hooks';

import ScrumboardColumnStyles from '@Features/scrumboard/ScrumboardColumn.module.scss';

function PiplineStageDeletePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  // TODO:  Change assertion to runtime check later, using type guard.
  // TODO:  Apply this approach to the other components using useLocation.
  const { state } = useLocation();
  const [locationState] = useState(state);

  useEffect(() => {
    const column = document.querySelector(`[data-rbd-droppable-id="${locationState.columnId}"]`);
    column?.classList.add(ScrumboardColumnStyles.dangerColumn);

    return () => column?.classList.remove(ScrumboardColumnStyles.dangerColumn);
  }, [locationState.columnId]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit: SubmitHandler<Record<string, never>> = () => {
    reduxDispatch(deleteStage({ stageId: locationState.columnId }));
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title={`Delete Stage: ${locationState.columnTitle}`} />
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormModal.DeleteButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PiplineStageDeletePage;
