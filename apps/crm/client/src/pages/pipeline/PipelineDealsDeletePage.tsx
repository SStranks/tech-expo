import type { SubmitHandler } from 'react-hook-form';

import { Navigate, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { useReduxDispatch } from '@Redux/hooks';
import { parseUUID } from '@Utils/routeParams';

import { deleteAllDealsInStage } from '../../features/scrumboard/redux/pipeline.slice';

import ScrumboardCardStyles from '@Features/scrumboard/ScrumboardCard.module.scss';

function PiplineDealsDeletePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const { stageId: stageIdParam } = useParams();

  const stageId = parseUUID(stageIdParam);

  useEffect(() => {
    if (!stageId) return;
    const column = document.querySelector(`[data-rbd-droppable-id="${stageId}"]`);
    const cards = column?.querySelectorAll('[data-rbd-draggable-id]');
    cards?.forEach((card) => card.classList.add(ScrumboardCardStyles.dangerCard));

    return () => cards?.forEach((card) => card.classList.remove(ScrumboardCardStyles.dangerCard));
  }, [stageId]);

  if (!stageId) return <Navigate to="/pipeline" replace />;

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  const onSubmit: SubmitHandler<Record<string, never>> = () => {
    reduxDispatch(deleteAllDealsInStage({ id: stageId }));
    setPortalActiveInternal(false);
    void navigate(-1);
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
