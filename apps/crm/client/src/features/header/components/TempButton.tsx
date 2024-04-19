import FormModal from '#Components/modal/FormModal';
import { IconEye } from '#Svg/icons';
import { useState } from 'react';

interface IListItem {
  id: string;
  name: string;
}
let listItems: IListItem[] = [
  { id: 'a', name: 'Aerospace' },
  { id: 'b', name: 'Mechanical' },
  { id: 'c', name: 'Civil' },
  // { id: 'd', name: 'Biomedical' },
  // { id: 'e', name: 'Nuclear' },
  // { id: 'f', name: 'Industrial' },
  // { id: 'g', name: 'Chemical' },
  // { id: 'h', name: 'Agricultural' },
  // { id: 'i', name: 'Electrical' },
];

// console.log(listItems);

function TempButton(): JSX.Element {
  const [portalActive, setPortalActive] = useState<boolean>(true);

  const btnClickHandler = () => {
    setPortalActive(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, unicorn/consistent-function-scoping
  const onSubmit = async (data: any) => {
    console.log('FORM SUBMITTED!', data);
  };

  const defaultValues = {
    input: '',
    textarea: '',
    inputSelect: '',
    inputCombo: '',
    inputNumber: undefined,
    inputDatePicker: '',
    inputTimeField: '',
    inputTagGroup: listItems,
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
        <FormModal.Input name="input" type="text" label="Text Input" rules={{ required: true }} />
        <FormModal.TagGroup name="inputTagGroup" label="Input TagGroup" rules={{ required: true }} />
        {/* <FormModal.TextArea name="textarea" label="Textarea Input" rules={{ required: true }} /> */}
        {/* <FormModal.Select name="inputSelect" label="Select Input" items={listItems} rules={{ required: true }} /> */}
        {/* <FormModal.Combo name="inputCombo" label="Combo Input" items={listItems} rules={{ required: true }} /> */}
        {/* <FormModal.Number
          name="inputNumber"
          label="Number Input"
          rules={{ required: 'Required', validate: (val) => !Number.isNaN(val) || 'NaN' }}
        /> */}
        {/* <FormModal.DatePicker name="inputDatePicker" label="Input Date Picker" rules={{ required: 'Required' }} /> */}
        {/* <FormModal.TimeField name="inputTimeField" label="Input Time Field" rules={{ required: 'Required' }} /> */}
      </FormModal>
    </>
  );
}

export default TempButton;
