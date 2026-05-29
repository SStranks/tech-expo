import type { SubmitHandler } from 'react-hook-form';

import { useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';
import { createDealThunk } from '@Features/scrumboard/redux/pipeline.thunks';
import { useReduxDispatch } from '@Redux/hooks';
import { parseUUID } from '@Utils/routeParams';

// TEMP DEV: .
const companiesList = [{ name: 'Microsoft' }, { name: 'Linux' }];
const ownersList = [{ name: 'Bob' }, { name: 'Dave' }];

type FormFieldData = {
  companyTitle: string;
  dealOwner: string;
  dealStage: string;
  dealTitle: string;
  dealValue: number;
};

function PipelineDealCreatePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  // const { columns, columnOrder } = useReduxSelector((store) => store.scrumboardPipeline);
  const reduxDispatch = useReduxDispatch();
  const navigate = useNavigate();
  const { stageId: stageIdParam } = useParams({ from: '/pipeline/deal/create/$stageId' });

  const stageId = parseUUID(stageIdParam);

  // TODO:  Make dynamic; check RHF Provider; can we change the type from { name: string } to just string[]??
  // const stageList = ['unassigned', ...columnOrder.map((columnId) => columns[columnId].title), 'won', 'lost'];
  const stageList = [{ name: 'unassigned' }, { name: 'new' }, { name: 'won' }, { name: 'lost' }];

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate({ to: '/pipeline' });
  };

  const onSubmit: SubmitHandler<FormFieldData> = async (data) => {
    const { companyTitle, dealTitle } = data;
    await reduxDispatch(
      // TODO: Complete form fields here
      createDealThunk({
        companyLogo: '',
        companyTitle,
        daysElapsed: 0,
        dealTitle,
        dealTotal: 0,
        orderKey: '',
        stageId,
        userImage: '',
      })
    );
    setPortalActiveInternal(false);
    void navigate({ to: '/pipeline' });
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
          <FormProvider.SubmitButton name="submit" />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default PipelineDealCreatePage;
