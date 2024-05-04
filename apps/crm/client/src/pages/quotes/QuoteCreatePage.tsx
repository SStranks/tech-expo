import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormModal from '#Components/modal/FormModal';

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
    <div className="">
      <FormModal
        modalTitle="Create Quote"
        portalActive={portalActive}
        setPortalActive={setPortalActive}
        onSubmit={onSubmit}>
        <FormModal.Input type="text" rules={{ required: true }} name="quoteTitle" label="Quote Title" />
        <FormModal.Combo items={listItems} name="salesOwner" label="Sales Owner" />
        <FormModal.Combo items={listItems} rules={{ required: true }} name="company" label="Company" />
        <FormModal.Combo items={listItems} rules={{ required: true }} name="quoteContact" label="Quote Contact" />
      </FormModal>
    </div>
  );
}

export default QuoteCreatePage;
