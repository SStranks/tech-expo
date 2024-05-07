import { PropsWithChildren, useId } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import {
  FormProviderSubmitButton,
  FormProviderInput,
  FormProviderCombo,
  FormProviderComboTag,
  FormProviderDatePicker,
  FormProviderNumber,
  FormProviderSelect,
  FormProviderTagGroup,
  FormProviderTextArea,
  FormProviderTimeField,
} from './';

interface IProps {
  defaultValues?: Record<string, unknown>;
  onSubmit: (data: unknown) => void;
}

// Compound Component Parent
function RHFFormProvider({ children, defaultValues = {}, onSubmit }: PropsWithChildren<IProps>): JSX.Element {
  const methods = useForm({ defaultValues, mode: 'onChange' });
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
