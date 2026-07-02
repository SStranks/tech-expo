import type { PropsWithChildren } from 'react';

import { useForm } from 'react-hook-form';

type Props<P> = PropsWithChildren<Omit<P, 'register' | 'error' | 'isDirty' | 'invalid' | 'isSubmitted'>>;

export function withReactHookForm<P extends object>(
  Component: React.ComponentType<P>,
  fieldName = 'value',
  rules = {}
) {
  return function Wrapper(props: Props<P>) {
    const { children, ...rest } = props;
    const form = useForm({ defaultValues: { [fieldName]: '' } });
    const field = form.getFieldState(fieldName, form.formState);

    return (
      <Component
        {...(rest as P)}
        register={form.register(fieldName, rules)}
        error={field.error}
        isDirty={field.isDirty}
        invalid={field.invalid}
        isSubmitted={form.formState.isSubmitted}>
        {children}
      </Component>
    );
  };
}
