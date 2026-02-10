import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import FormModal from '@Components/modal/FormModal';
import FormProvider from '@Components/react-hook-form/form-provider/FormProvider';
import { GENERIC_TEXT_RULES } from '@Components/react-hook-form/validationRules';

/*
// TEMP DEV: // TODO: .
  Need to get dynamic lists: sales owner = users in settings list; quote contact = user from contacts list;
  company = company from companies list
*/
const listItems = [{ name: 'Adam' }, { name: 'Bob' }, { name: 'Chuck' }, { name: 'Dave' }];

function QuoteUpdatePage(): React.JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(true);
  const navigate = useNavigate();
  const { quoteId } = useParams();

  if (!quoteId) return <Navigate to="/quotes" replace />;

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  const onSubmit = () => {
    alert('Quote Update Submitted');
    setPortalActiveInternal(false);
    void navigate(-1);
  };

  return (
    <FormModal portalActive={portalActive} setPortalActive={setPortalActive}>
      <FormProvider onSubmit={onSubmit}>
        <FormModal.Header title="Update Quote" />
        <FormModal.Content>
          <FormProvider.Input
            type="text"
            rules={GENERIC_TEXT_RULES}
            name="quoteTitle"
            label="Quote Title"
            // defaultValue={title} // TODO: Setup quote.title
          />
          <FormProvider.Combo items={listItems} rules={GENERIC_TEXT_RULES} name="salesOwner" label="Sales Owner" />
          <FormProvider.Combo items={listItems} rules={GENERIC_TEXT_RULES} name="company" label="Company" />
          <FormProvider.Combo items={listItems} rules={GENERIC_TEXT_RULES} name="quoteContact" label="Quote Contact" />
        </FormModal.Content>
        <FormModal.Footer>
          <FormModal.CancelButton />
          <FormProvider.SubmitButton name="submit" />
        </FormModal.Footer>
      </FormProvider>
    </FormModal>
  );
}

export default QuoteUpdatePage;
