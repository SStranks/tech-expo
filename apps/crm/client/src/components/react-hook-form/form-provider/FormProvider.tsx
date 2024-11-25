import { PropsWithChildren, useId } from 'react';
import { DefaultValues, FieldValues, FormProvider, SubmitHandler, useForm } from 'react-hook-form';

import {
  FormProviderCombo,
  FormProviderComboTag,
  FormProviderDatePicker,
  FormProviderInput,
  FormProviderNumber,
  FormProviderSelect,
  FormProviderSubmitButton,
  FormProviderTagGroup,
  FormProviderTextArea,
  FormProviderTimeField,
} from './';

interface IProps<T extends FieldValues> {
  defaultValues?: DefaultValues<T>;
  onSubmit: SubmitHandler<T>;
}

// Compound Component Parent
function RHFFormProvider<T extends FieldValues>({
  children,
  defaultValues,
  onSubmit,
}: PropsWithChildren<IProps<T>>): JSX.Element {
  const methods = useForm<T>({ defaultValues, mode: 'onChange' });
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
