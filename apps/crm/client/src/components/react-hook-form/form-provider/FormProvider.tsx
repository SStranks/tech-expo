import type { DefaultValues, FieldValues, Mode, SubmitHandler } from 'react-hook-form';

import { PropsWithChildren, useId } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

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
  mode?: Mode;
}

// Compound Component Parent
function RHFFormProvider<T extends FieldValues>({
  children,
  defaultValues,
  mode = 'onSubmit',
  onSubmit,
}: PropsWithChildren<IProps<T>>): React.JSX.Element {
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
