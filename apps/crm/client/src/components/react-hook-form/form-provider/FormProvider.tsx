import type { PropsWithChildren } from 'react';
import type { DefaultValues, FieldValues, Mode, SubmitHandler } from 'react-hook-form';

import { useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import FormProviderCombo from './components/FormProviderCombo';
import FormProviderComboTag from './components/FormProviderComboTag';
import FormProviderDatePicker from './components/FormProviderDatePicker';
import FormProviderInput from './components/FormProviderInput';
import FormProviderNumber from './components/FormProviderNumber';
import FormProviderSelect from './components/FormProviderSelect';
import FormProviderSubmitButton from './components/FormProviderSubmitButton';
import FormProviderTagGroup from './components/FormProviderTagGroup';
import FormProviderTextArea from './components/FormProviderTextArea';
import FormProviderTimeField from './components/FormProviderTimeField';

interface Props<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
  mode?: Mode;
}

// Compound Component Parent
function RHFFormProvider<T extends FieldValues>({
  children,
  defaultValues,
  mode = 'onSubmit',
  onSubmit,
}: PropsWithChildren<Props<T>>): React.JSX.Element {
  const methods = useForm<T>({ defaultValues, mode });
  const genId = useId();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} id={`form-${genId}`}>
        {children}
      </form>
    </FormProvider>
  );
}

RHFFormProvider.SubmitButton = FormProviderSubmitButton;
RHFFormProvider.Input = FormProviderInput;
RHFFormProvider.TextArea = FormProviderTextArea;
RHFFormProvider.Number = FormProviderNumber;
RHFFormProvider.Select = FormProviderSelect;
RHFFormProvider.Combo = FormProviderCombo;
RHFFormProvider.ComboTag = FormProviderComboTag;
RHFFormProvider.TagGroup = FormProviderTagGroup;
RHFFormProvider.TimeField = FormProviderTimeField;
RHFFormProvider.DatePicker = FormProviderDatePicker;

export default RHFFormProvider;
