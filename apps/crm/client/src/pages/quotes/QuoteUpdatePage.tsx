import type { CoreRow } from '@tanstack/react-table';
import type { ITableDataQuotes } from '#Data/MockData';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FormProvider } from '#Components/react-hook-form';
import FormModal from '#Components/modal/FormModal';
import { GENERIC_TEXT_RULES } from '#Components/react-hook-form/validationRules';

// TEMP DEV: // TODO:  Need to get dynamic lists: sales owner = users in settings list; quote contact = user from contacts list; company = company from companies list
const listItems = [{ name: 'Adam' }, { name: 'Bob' }, { name: 'Chuck' }, { name: 'Dave' }];

function QuoteUpdatePage(): JSX.Element {
  const [portalActive, setPortalActiveInternal] = useState<boolean>(false);
  const navigate = useNavigate();
  // TODO:  Change assertion to runtime check later, using type guard.
  // TODO:  Apply this approach to the other components using useLocation.
  const state = useLocation().state as CoreRow<ITableDataQuotes>['original'];
  const [title] = useState(() => state.title);

  useEffect(() => {
    setPortalActiveInternal(true);
  }, [setPortalActiveInternal]);

  const setPortalActive = () => {
    setPortalActiveInternal(false);
    navigate(-1);
  };

  const onSubmit = () => {
    alert('Quote Update Submitted');
    setPortalActiveInternal(false);
    navigate(-1);
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
            defaultValue={title}
          />
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

export default QuoteUpdatePage;
