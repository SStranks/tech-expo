import type { SubmitHandler } from 'react-hook-form';

import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { deleteDeal } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch } from '@Redux/hooks';

import ScrumboardCardStyles from '@Features/scrumboard/ScrumboardCard.module.scss';

function PiplineDealDeletePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const { dealId, stageId } = useParams();

  useEffect(() => {
    if (!dealId || !stageId) return;
    const column = document.querySelector(`[data-rbd-droppable-id="${stageId}"]`);
    const card = column?.querySelector(`[data-rbd-draggable-id="${dealId}"]`);
    card?.classList.add(ScrumboardCardStyles.dangerCard);

    return () => card?.classList.remove(ScrumboardCardStyles.dangerCard);
  }, [stageId, dealId]);

  if (!dealId || !stageId) return <Navigate to="/pipeline" replace />;

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  const onSubmit: SubmitHandler<Record<string, never>> = () => {
    reduxDispatch(deleteDeal({ dealId, stageId }));
    setPortalActiveInternal(false);
    void navigate(-1);
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
