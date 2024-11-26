import type { SubmitHandler } from 'react-hook-form';

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import { FormProvider } from '@Components/react-hook-form';
import { GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';
import { createDeal } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch } from '@Redux/hooks';

// TEMP DEV: .
const companiesList = [{ name: 'Microsoft' }, { name: 'Linux' }];
const ownersList = [{ name: 'Bob' }, { name: 'Dave' }];

type IFormData = {
  companyTitle: string;
  dealStage: string;
  dealTitle: string;
  dealValue: number;
  dealOwner: string;
};

function PipelineDealCreatePage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  // const { columns, columnOrder } = useReduxSelector((store) => store.scrumboardPipeline);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [locationState] = useState(state);

  // TODO:  Make dynamic; check RHF Provider; can we change the type from { name: string } to just string[]??
  // const stageList = ['unassigned', ...columnOrder.map((columnId) => columns[columnId].title), 'won', 'lost'];
  const stageList = [{ name: 'unassigned' }, { name: 'new' }, { name: 'won' }, { name: 'lost' }];

  useEffect(() => {
    setPortalActiveInternal(true);
  }, [setPortalActiveInternal]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit: SubmitHandler<IFormData> = (data) => {
    const { companyTitle, dealOwner, dealStage, dealTitle, dealValue } = data;
    const { columnId } = locationState;
    reduxDispatch(createDeal({ columnId, companyTitle, dealOwner, dealStage, dealTitle, dealValue }));
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Create New Deal" />
        <FormModal.Content>
          <FormProvider.Input type="text" rules={GENERIC_TEXT_RULES} name="dealTitle" label="Deal Title" />
          <FormProvider.Combo
            items={companiesList}
            rules={GENERIC_TEXT_RULES}
            shouldFocusWrap
            menuTrigger="focus"
            name="companyTitle"
            label="Company"
          />
          <div className="">
            <FormProvider.Select items={stageList} name="dealStage" label="Deal Stage" />
            <FormProvider.Input type="number" rules={GENERIC_TEXT_RULES} name="dealValue" label="Deal Value" />
          </div>
          <FormProvider.Combo
            items={ownersList}
            rules={GENERIC_TEXT_RULES}
            shouldFocusWrap
            menuTrigger="focus"
            name="dealOwner"
            label="Deal Owner"
          />
        </FormModal.Content>
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormProvider.SubmitButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PipelineDealCreatePage;
