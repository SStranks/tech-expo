import FormModal from '#Components/modal/FormModal';
import { IconEye } from '#Svg/icons';
import { useState } from 'react';

// let listItems = [
//   { name: 'Aerospace' },
//   { name: 'Mechanical' },
//   { name: 'Civil' },
//   { name: 'Biomedical' },
//   { name: 'Nuclear' },
//   { name: 'Industrial' },
//   { name: 'Chemical' },
//   { name: 'Agricultural' },
//   { name: 'Electrical' },
// ];

function TempButton(): JSX.Element {
  const [portalActive, setPortalActive] = useState<boolean>(true);

  const btnClickHandler = () => {
    setPortalActive(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, unicorn/consistent-function-scoping
  const onSubmit = async (data: any) => {
    console.log(data);
  };

  const defaultValues = {
    input: '',
    textarea: '',
    inputSelect: '',
    inputCombo: '',
    inputNumber: undefined,
    inputDatePicker: '',
    inputTimeField: '',
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
        <FormModal.Input name="input" type="text" label="Piss Stop" rules={{ required: true }} />
        <FormModal.TextArea name="textarea" label="Piss Stop" rules={{ required: true }} />
        {/* <FormModal.Select name="inputSelect" label="Piss Stop" items={listItems} rules={{ required: true }} /> */}
        {/* <FormModal.Combo name="inputCombo" label="Piss Stop" items={listItems} rules={{ required: true }} /> */}
        {/* <FormModal.Number
          name="inputNumber"
          label="Piss Stop"
          rules={{ required: 'Required', validate: (val) => !Number.isNaN(val) || 'NaN' }}
        /> */}
        {/* <FormModal.DatePicker name="inputDatePicker" label="Date Picker" /> */}
        {/* <FormModal.TimeField name="inputTimeField" label="Time Field" rules={{ required: 'Required' }} /> */}
      </FormModal>
    </>
  );
}

export default TempButton;
