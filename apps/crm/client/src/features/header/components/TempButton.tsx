import FormModal from '#Components/modal/FormModal';
import { IconEye } from '#Svg/icons';
import { useState } from 'react';

let listItems = [
  { name: 'Aerospace' },
  { name: 'Mechanical' },
  { name: 'Civil' },
  { name: 'Biomedical' },
  { name: 'Nuclear' },
  { name: 'Industrial' },
  { name: 'Chemical' },
  { name: 'Agricultural' },
  { name: 'Electrical' },
];

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
    Cunt: '',
    // Cunt2: 'Mechanical4', // InputCombo
    // Cunt3: undefined, // InputNumber
    // Cunt4: null, // DatePicker
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
        <FormModal.Input name="input" type="text" label="Piss Stop" />
        <FormModal.TextArea name="textarea" label="Piss Stop" rules={{ required: true }} />
        <FormModal.Select name="Cunt" label="Piss Stop" items={listItems} rules={{ required: true }} />
        {/* <FormModal.Combo name="Cunt2" label="Piss Stop" items={listItems} rules={{ required: true }} /> */}
        {/* <FormModal.Number
          name="Cunt3"
          label="Piss Stop"
          rules={{ required: 'Required', validate: (val) => !Number.isNaN(val) || 'NaN' }}
        /> */}
        {/* <FormModal.DatePicker name="Cunt4" label="pee pee" rules={{ required: 'Required' }} /> */}
        {/* <InputDatePicker name="Cunt4" label="pee pee" rules={{ required: 'Required' }} /> */}
      </FormModal>
    </>
  );
}

export default TempButton;
