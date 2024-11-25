import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormModal from '#Components/modal/FormModal';
import { FormProvider } from '#Components/react-hook-form';
import { GENERIC_TEXT_RULES } from '#Components/react-hook-form/validationRules';

// TEMP DEV: .
const listItems = [{ name: 'Adam' }, { name: 'Bob' }, { name: 'Chuck' }, { name: 'Dave' }];

function QuoteCreatePage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setPortalActiveInternal(true);
  }, [setPortalActiveInternal]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit = () => {
    alert('Quote Create Submitted');
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Create Quote" />
        <FormModal.Content>
          <FormProvider.Input type="text" rules={GENERIC_TEXT_RULES} name="quoteTitle" label="Quote Title" />
          <FormProvider.Combo items={listItems} rules={GENERIC_TEXT_RULES} name="salesOwner" label="Sales Owner" />
          <FormProvider.Combo items={listItems} rules={GENERIC_TEXT_RULES} name="company" label="Company" />
          <FormProvider.Combo items={listItems} rules={GENERIC_TEXT_RULES} name="quoteContact" label="Quote Contact" />
        </FormModal.Content>
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormProvider.SubmitButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default QuoteCreatePage;

{
  /* <>
  <FormModal.Combo items={listItems} name="salesOwner" label="Sales Owner" />
  <FormModal.Combo items={listItems} rules={{ required: true }} name="company" label="Company" />
  <FormModal.Combo items={listItems} rules={{ required: true }} name="quoteContact" label="Quote Contact" />
</>; */
}
