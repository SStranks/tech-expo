import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import { FormProvider } from '@Components/react-hook-form';
import { GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';

// TEMP DEV: .
const listItems = [{ name: 'Adam' }, { name: 'Bob' }, { name: 'Chuck' }, { name: 'Dave' }];

function CompaniesCreatePage(): React.JSX.Element {
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
    alert('Companies Create Submitted');
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Create Company" />
        <FormModal.Content>
          <FormProvider.Input type="text" rules={GENERIC_TEXT_RULES} name="companyName" label="Company Name" />
          <FormProvider.Combo items={listItems} rules={GENERIC_TEXT_RULES} name="salesOwner" label="Sales Owner" />
        </FormModal.Content>
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormProvider.SubmitButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default CompaniesCreatePage;
