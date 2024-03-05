/* eslint-disable unicorn/no-null */
import { PropsWithChildren, useId, useRef } from 'react';
import { FormProvider, RegisterOptions, useForm, useFormContext } from 'react-hook-form';
import { CSSTransition } from 'react-transition-group';
import Button from '#Components/buttons/Button';
import { Input as RHFInput } from '#Components/react-hook-form';
import usePortalClose from '#Hooks/usePortalClose';
import { CTG_ENTER_MODAL, CTG_EXIT_MODAL } from '#Utils/cssTransitionGroup';
import ReactPortal from './ReactPortal';
import styles from './_FormModal.module.scss';

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
    <RHFInput
      register={{ ...register(name, rules) }}
      isDirty={dirtyFields[name]}
      error={errors[name as string]}
      type={type}
      label={label}
    />
  );
};
