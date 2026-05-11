import type { SubmitHandler } from 'react-hook-form';

import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { deleteDealThunk } from '@Features/scrumboard/redux/pipeline.thunks';
import { useReduxDispatch } from '@Redux/hooks';
import { parseUUID } from '@Utils/routeParams';

import ScrumboardCardStyles from '@Features/scrumboard/ScrumboardCard.module.scss';

function PiplineDealDeletePage(): React.JSX.Element {
  const { dealId: dealIdParam, stageId: stageIdParam } = useParams({ from: '/pipeline/deal/delete/$stageId/$dealId' });
  const dealId = parseUUID(dealIdParam);
  const stageId = parseUUID(stageIdParam);

  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const column = document.querySelector(`[data-rbd-droppable-id="${stageId}"]`);
    const card = column?.querySelector(`[data-rbd-draggable-id="${dealId}"]`);
    card?.classList.add(ScrumboardCardStyles.dangerCard);

    return () => card?.classList.remove(ScrumboardCardStyles.dangerCard);
  }, [stageId, dealId]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate({ to: '/pipeline' });
  };

  const onSubmit: SubmitHandler<Record<string, never>> = async () => {
    await reduxDispatch(deleteDealThunk({ id: dealId }));
    setPortalActiveInternal(false);
    void navigate({ to: '/pipeline' });
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
