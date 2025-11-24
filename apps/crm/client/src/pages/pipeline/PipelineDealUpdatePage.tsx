import type { SubmitHandler } from 'react-hook-form';

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import { FormProvider } from '@Components/react-hook-form';
import { GENERIC_NUMBER_RULES, GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';
import { updateDeal } from '@Features/scrumboard/redux/pipelineSlice';
import { useReduxDispatch, useReduxSelector } from '@Redux/hooks';

// TEMP DEV: .
const companiesList = [{ name: 'Microsoft' }, { name: 'Linux' }];
const ownersList = [{ name: 'Bob' }, { name: 'Dave' }];

type IFormData = {
  companyTitle: string;
  dealStage: string;
  dealTitle: string;
  dealTotal: number;
  dealOwner: string;
};

function PipelineDealUpdatePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [locationState] = useState(state);
  const task = useReduxSelector((store) => store.scrumboardPipeline.tasks[locationState.taskId]);
  const reduxDispatch = useReduxDispatch();

  // TODO:  Make dynamic; check RHF Provider; can we change the type from { name: string } to just string[]??
  // const stageList = ['unassigned', ...columnOrder.map((columnId) => columns[columnId].title), 'won', 'lost'];
  const stageList = [{ name: 'unassigned' }, { name: 'new' }, { name: 'won' }, { name: 'lost' }];

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit: SubmitHandler<IFormData> = (data) => {
    const { companyTitle, dealOwner, dealStage, dealTitle, dealTotal } = data;
    const taskId = task.id;

    reduxDispatch(
      updateDeal({
        companyTitle,
        dealOwner,
        dealStage,
        dealTitle,
        dealTotal,
        dealValue: 0,
        taskId,
      })
    );
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider
        onSubmit={onSubmit}
        defaultValues={{
          companyTitle: task.companyTitle,
          dealOwner: 'Bob',
          dealStage: 'new',
          dealTitle: task.dealTitle,
          dealTotal: task.dealTotal,
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
            defaultInputValue={ownersList[0].name} // TODO:  Make dynamic
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
