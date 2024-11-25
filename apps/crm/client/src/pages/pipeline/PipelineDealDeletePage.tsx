import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import FormModal from '#Components/modal/FormModal';
import { FormProvider } from '#Components/react-hook-form';
import { ScrumboardCardStyles } from '#Features/scrumboard';
import { deleteDeal } from '#Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch } from '#Redux/hooks';

function PiplineDealDeletePage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  // TODO:  Change assertion to runtime check later, using type guard.
  // TODO:  Apply this approach to the other components using useLocation.
  const { state } = useLocation();
  const [locationState] = useState(state);

  useEffect(() => {
    setPortalActiveInternal(true);
  }, [setPortalActiveInternal]);

  useEffect(() => {
    const column = document.querySelector(`[data-rbd-droppable-id="${locationState.columnId}"]`);
    console.log(column);
    const card = column?.querySelector(`[data-rbd-draggable-id="${locationState.taskId}"]`);
    card?.classList.add(ScrumboardCardStyles.dangerCard);

    return () => card?.classList.remove(ScrumboardCardStyles.dangerCard);
  }, [locationState.columnId, locationState.taskId]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit: SubmitHandler<Record<string, never>> = () => {
    reduxDispatch(deleteDeal({ columnId: locationState.columnId, taskId: locationState.taskId }));
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Delete Deal: <MAKE DYANMIC> " />
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormModal.DeleteButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PiplineDealDeletePage;
