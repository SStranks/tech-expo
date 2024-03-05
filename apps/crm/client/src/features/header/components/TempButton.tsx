import FormModal from '#Components/modal/FormModal';
import { IconEye } from '#Svg/icons';
import { useState } from 'react';

function TempButton(): JSX.Element {
  const [portalActive, setPortalActive] = useState<boolean>(true);

  const btnClickHandler = () => {
    setPortalActive(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, unicorn/consistent-function-scoping
  const onSubmit = async (data: any) => {
    await console.log(data);
  };

  const defaultValues = {
    firstName: '',
  };

  return (
    <>
      <button type="button" onClick={btnClickHandler}>
        <img src={IconEye} alt="" />
      </button>
      <FormModal
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        modalTitle={'Form Modal'}
        portalActive={portalActive}
        setPortalActive={setPortalActive}>
        <FormModal.Input name="firstName" type="text" label="Piss Stop" />
      </FormModal>
    </>
  );
}

export default TempButton;
