/* eslint-disable unicorn/no-null */
import { PropsWithChildren, useId, useRef } from 'react';
import { Controller, FormProvider, RegisterOptions, useForm, useFormContext } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';
import Button from '#Components/buttons/Button';
import { Input as RHFInput, TextArea as RHFTextArea } from '#Components/react-hook-form';
import usePortalClose from '#Hooks/usePortalClose';
import { CTG_ENTER_MODAL, CTG_EXIT_MODAL } from '#Utils/cssTransitionGroup';
import ReactPortal from './ReactPortal';
import styles from './_FormModal.module.scss';
import InputNumber from '#Components/inputs/number/InputNumber';
import InputUx from '#Components/react-hook-form/InputUx';
import InputParser from '#Components/react-hook-form/InputParser';
import InputDatePicker from '#Components/inputs/date-picker/InputDatePicker';
import { getLocalTimeZone, today } from '@internationalized/date';
import InputCombo from '#Components/inputs/combo/InputCombo';
import InputSelect from '#Components/inputs/select/Select';

interface IProps {
  modalTitle: string;
  portalActive: boolean;
  setPortalActive: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: unknown) => void;
  defaultValues?: Record<string, unknown>;
}

function FormModal({
  children = undefined,
  onSubmit,
  defaultValues = {},
  modalTitle,
  portalActive,
  setPortalActive,
}: PropsWithChildren<IProps>): JSX.Element {
  const portalContentRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const methods = useForm({ defaultValues });
  const genId = useId();
  usePortalClose(portalActive, setPortalActive, modalContentRef, null);

  const closeModal = () => {
    setPortalActive(false);
  };

  return (
    <ReactPortal wrapperId="form">
      <CSSTransition
        in={portalActive}
        timeout={{ enter: CTG_ENTER_MODAL, exit: CTG_EXIT_MODAL }}
        onExited={() => methods.reset()}
        unmountOnExit
        classNames={{
          enter: `${styles['enter']}`,
          enterActive: `${styles['enterActive']}`,
          enterDone: `${styles['enterDone']}`,
          exit: `${styles['exit']}`,
          exitActive: `${styles['exitActive']}`,
        }}
        nodeRef={portalContentRef}>
        <div className={styles.portalContent} ref={portalContentRef}>
          <div className={styles.formModal} ref={modalContentRef}>
            <div className={styles.formModal__header}>
              <h4>{modalTitle}</h4>
              <Button buttonClickFn={closeModal} buttonIcon="close" buttonStyle="quaternary" />
            </div>
            <div className={styles.formModal__content}>
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} id={`form-${genId}`} className={styles.formModal__form}>
                  {children}
                </form>
              </FormProvider>
            </div>
            <div className={styles.formModal__footer}>
              <Button buttonClickFn={closeModal} buttonText="Cancel" buttonStyle="secondary" />
              <Button
                type="submit"
                form={`form-${genId}`}
                buttonDisabled={methods.formState.isSubmitting}
                buttonText="Save"
              />
            </div>
          </div>
        </div>
      </CSSTransition>
    </ReactPortal>
  );
}

export default FormModal;

interface IInput {
  name: string;
  type: React.HTMLInputTypeAttribute;
  label: string;
  rules?: RegisterOptions;
}

FormModal.Input = function Input({ name, type, label, rules = {} }: IInput) {
  const {
    register,
    formState: { errors, dirtyFields },
  } = useFormContext();

  return (
    <InputUx errorMessage={errors[name as string]?.message} isDirty={dirtyFields[name]} isRequired={rules?.required}>
      <RHFInput register={{ ...register(name, rules) }} error={errors[name as string]} type={type} label={label} />
    </InputUx>
  );
};

interface ITextArea {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

FormModal.TextArea = function TextArea({ name, label, rules = {} }: ITextArea) {
  const {
    register,
    formState: { errors, dirtyFields },
  } = useFormContext();

  return (
    <InputUx errorMessage={errors[name as string]?.message} isDirty={dirtyFields[name]} isRequired={rules?.required}>
      <RHFTextArea register={register} name={name} rules={rules} error={errors[name as string]} label={label} />
    </InputUx>
  );
};

interface ISelect {
  name: string;
  label: string;
  items: { name: string }[];
  rules?: RegisterOptions;
}

FormModal.Select = function Select({ name, label, items, rules = {} }: ISelect) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, value, onChange, onBlur }, fieldState: { isDirty, invalid: isInvalid, error } }) => (
        <InputUx errorMessage={error?.message} isDirty={isDirty} isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputSelect}
            value={value}
            onChange={onChange}
            {...{ name, label, items, onBlur, isInvalid }}
          />
        </InputUx>
      )}
    />
  );
};

interface ICombo {
  name: string;
  label: string;
  items: { name: string }[];
  rules?: RegisterOptions;
}

FormModal.Combo = function Combo({ name, label, items, rules = {} }: ICombo) {
  const {
    control,
    formState: { defaultValues },
  } = useFormContext();

  const defaultValue = defaultValues?.[name];

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, value, onChange, onBlur }, fieldState: { invalid: isInvalid, isDirty, error } }) => (
        <InputUx errorMessage={error?.message} isDirty={isDirty} isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputCombo}
            value={value}
            onChange={onChange}
            {...{ name, label, items, onBlur, defaultValue, isInvalid }}
          />
        </InputUx>
      )}
    />
  );
};

interface INumber {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

FormModal.Number = function Number({ name, label, rules = {} }: INumber) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, value, onChange, onBlur }, fieldState: { invalid: isInvalid, error, isDirty } }) => (
        <InputUx errorMessage={error?.message} isDirty={isDirty} isRequired={rules?.required}>
          <InputParser ReactAriaComponent={InputNumber} {...{ name, value, onChange, label, onBlur, isInvalid }} />
        </InputUx>
      )}
    />
  );
};

interface IDatePicker {
  name: string;
  label: string;
  rules?: RegisterOptions;
}

FormModal.DatePicker = function DatePicker({ name, label, rules = {} }: IDatePicker) {
  const { control } = useFormContext();
  const placeholder = today(getLocalTimeZone());

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { name, value, onChange, onBlur }, fieldState: { invalid: isInvalid, error, isDirty } }) => (
        <InputUx errorMessage={error?.message} isDirty={isDirty} isRequired={rules?.required}>
          <InputParser
            ReactAriaComponent={InputDatePicker}
            value={value}
            onChange={onChange}
            {...{ name, label, onBlur, isInvalid, placeholder }}
          />
        </InputUx>
      )}
    />
  );
};
