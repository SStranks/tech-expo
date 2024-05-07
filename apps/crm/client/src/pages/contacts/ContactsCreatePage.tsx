import FormModal from '#Components/modal/FormModal';
import { FormProvider } from '#Components/react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TEMP DEV: .
const listItems = [{ name: 'Adam' }, { name: 'Bob' }, { name: 'Chuck' }, { name: 'Dave' }];

function ContactsCreatePage(): JSX.Element {
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
    alert('Contact Create Submitted');
    setPortalActiveInternal(false);
    navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Create Contact" />
        <FormModal.Content>
          <FormProvider.Input
            type="text"
            rules={{ required: true, pattern: /test/ }}
            name="contactName"
            label="Contact Name"
          />
          <FormProvider.Input
            type="email"
            rules={{ required: true, pattern: /test/ }}
            name="contactEmail"
            label="Contact Email"
          />
          <FormProvider.Combo items={listItems} name="company" label="Company" />
        </FormModal.Content>
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormProvider.SubmitButton />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default ContactsCreatePage;
