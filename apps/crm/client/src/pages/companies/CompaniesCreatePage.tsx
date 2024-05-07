import FormModal from '#Components/modal/FormModal';
import { FormProvider } from '#Components/react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TEMP DEV: .
const listItems = [{ name: 'Adam' }, { name: 'Bob' }, { name: 'Chuck' }, { name: 'Dave' }];

function CompaniesCreatePage(): JSX.Element {
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
          <FormProvider.Input
            type="text"
            rules={{ required: true, pattern: /test/ }}
            name="companyName"
            label="Company Name"
          />
          <FormProvider.Combo items={listItems} name="salesOwner" label="Sales Owner" />
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
