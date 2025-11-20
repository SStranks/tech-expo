import type { PropsWithChildren } from 'react';
import type { DefaultValues, FieldValues, Mode } from 'react-hook-form';

import { FormProvider, useForm } from 'react-hook-form';

type TWithFormProvider<TFormValues extends FieldValues> = {
  defaultValues?: DefaultValues<TFormValues>;
  mode?: Mode;
};

export const WithFormProvider = <TFormValues extends FieldValues>({
  children,
  defaultValues,
  mode = 'onSubmit',
}: PropsWithChildren<TWithFormProvider<TFormValues>>) => {
  const methods = useForm<TFormValues>({ defaultValues, mode });

  return (
    <FormProvider {...methods}>
      <form noValidate onSubmit={methods.handleSubmit(() => {})}>
        {children}
      </form>
    </FormProvider>
  );
};
