import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import { FormProvider } from '@Components/react-hook-form';
import { ScrumboardCardStyles } from '@Features/scrumboard';
import { deleteDealsAll } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch } from '@Redux/hooks';

function PiplineDealsDeletePage(): React.JSX.Element {
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
    const cards = column?.querySelectorAll('[data-rbd-draggable-id]');
    cards?.forEach((card) => card.classList.add(ScrumboardCardStyles.dangerCard));

    return () => cards?.forEach((card) => card.classList.remove(ScrumboardCardStyles.dangerCard));
  }, [locationState.columnId]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit: SubmitHandler<Record<string, never>> = () => {
    reduxDispatch(deleteDealsAll({ columnId: locationState.columnId }));
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Delete All Deals " />
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormModal.DeleteButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PiplineDealsDeletePage;
