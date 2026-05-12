import type { SubmitHandler } from 'react-hook-form';

import { Navigate, useNavigate, useParams } from '@tanstack/react-router';
import { useState } from 'react';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { GENERIC_NUMBER_RULES, GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';
import { updateDealThunk } from '@Features/scrumboard/redux/pipeline.thunks';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';
import { parseUUID } from '@Utils/routeParams';

import { dealSelectors } from '../../features/scrumboard/redux/pipeline.slice';

// TEMP DEV: .
const companiesList = [{ name: 'Microsoft' }, { name: 'Linux' }];
const ownersList = [{ name: 'Bob' }, { name: 'Dave' }];

type FormData = {
  companyTitle: string;
  dealStage: string;
  dealTitle: string;
  dealTotal: number;
  dealOwner: string;
};

function PipelineDealUpdatePage(): React.JSX.Element {
  const { dealId: dealIdParam, stageId: stageIdParam } = useParams({ from: '/pipeline/deal/update/$stageId/$dealId' });
  const stageId = parseUUID(stageIdParam);
  const dealId = parseUUID(dealIdParam);

  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const navigate = useNavigate();
  const deal = useReduxSelector((state) => (dealId ? dealSelectors.selectById(state, dealId) : undefined));
  const reduxDispatch = useReduxDispatch();

  if (!deal || !dealId || !stageId) return <Navigate to="/pipeline" replace />;

  // TODO:  Make dynamic; check RHF Provider; can we change the type from { name: string } to just string[]??
  // const stageList = ['unassigned', ...columnOrder.map((columnId) => columns[columnId].title), 'won', 'lost'];
  const stageList = [{ name: 'unassigned' }, { name: 'new' }, { name: 'won' }, { name: 'lost' }];

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate({ to: '/pipeline' });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    await reduxDispatch(
      updateDealThunk({
        id: dealId,
        stageId,
        ...data,
      })
    );
    setPortalActiveInternal(false);
    void navigate({ to: '/pipeline' });
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider
        onSubmit={onSubmit}
        defaultValues={{
          companyTitle: deal.companyTitle,
          dealOwner: 'Bob',
          dealStage: 'new',
          dealTitle: deal.dealTitle,
          dealTotal: deal.dealTotal,
        }}>
        <FormModal.Header title="Edit Deal" />
        <FormModal.Content>
          <FormProvider.Input
            type="text"
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            rules={GENERIC_TEXT_RULES}
            name="dealTitle"
            label="Deal Title"
          />
          <FormProvider.Combo
            defaultItems={companiesList}
            // defaultInputValue={task.companyTitle}
            rules={GENERIC_TEXT_RULES}
            shouldFocusWrap
            menuTrigger="focus"
            name="companyTitle"
            label="Company"
          />
          <div
            className=""
            style={{ backgroundColor: 'inherit', display: 'flex', flexDirection: 'column', rowGap: '10px' }}>
            {/* // Make defaultSelectedKey dynamic; needs column-id */}
            <FormProvider.Select items={stageList} name="dealStage" label="Deal Stage" />
            <FormProvider.Number rules={GENERIC_NUMBER_RULES} name="dealTotal" label="Deal Value" />
          </div>
          <FormProvider.Combo
            items={ownersList}
            defaultInputValue={ownersList[0]?.name} // TODO:  Make dynamic
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

export default PipelineDealUpdatePage;
