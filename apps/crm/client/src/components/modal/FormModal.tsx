import { createContext, PropsWithChildren, useContext, useMemo, useRef } from 'react';

import ButtonCancel from '@Components/buttons/ButtonCancel';
import ButtonClose from '@Components/buttons/ButtonClose';
import ButtonDelete from '@Components/buttons/ButtonDelete';
import ButtonOkay from '@Components/buttons/ButtonOkay';
import usePortalClose from '@Hooks/usePortalClose';

import styles from './FormModal.module.scss';

type FormModalContext = {
  setPortalActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const FormModalContext = createContext<FormModalContext | null>(null);
const useFormModalContext = () => {
  const context = useContext(FormModalContext);
  if (!context) throw new Error('useFormModalContext out of scope of FormModalContext.Provider');
  return context;
};

type Props = {
  portalActive: boolean;
  setPortalActive: React.Dispatch<React.SetStateAction<boolean>>;
};

function FormModal({
  children = undefined,
  portalActive,
  setPortalActive: setPortalActiveProp,
}: PropsWithChildren<Props>): React.JSX.Element {
  const modalContentRef = useRef<HTMLDivElement>(null);
  usePortalClose(portalActive, setPortalActiveProp, modalContentRef);

  const setPortalActive = useMemo(() => setPortalActiveProp, [setPortalActiveProp]);

  return (
    <div className={styles.modalContainer}>
      <div className={styles.formModal} ref={modalContentRef}>
        <FormModalContext.Provider value={{ setPortalActive }}>{children}</FormModalContext.Provider>
      </div>
    </div>
  );
}

function Header({ title }: { title: string }): React.JSX.Element {
  return (
    <div className={styles.header}>
      <h4>{title}</h4>
      <FormModal.CloseButton />
    </div>
  );
}

function Content({ children }: PropsWithChildren): React.JSX.Element {
  return <div className={styles.content}>{children}</div>;
}

function Footer({ children }: PropsWithChildren): React.JSX.Element {
  return <div className={styles.footer}>{children}</div>;
}

function CloseButton(): React.JSX.Element {
  const { setPortalActive } = useFormModalContext();

  const closeModal = () => {
    setPortalActive(false);
  };

  return <ButtonClose onClick={closeModal} />;
}

function CancelButton(): React.JSX.Element {
  const { setPortalActive } = useFormModalContext();

  const closeModal = () => {
    setPortalActive(false);
  };
  return <ButtonCancel onClick={closeModal} />;
}

function OkayButton(): React.JSX.Element {
  const { setPortalActive } = useFormModalContext();

  const closeModal = () => {
    setPortalActive(false);
  };
  return <ButtonOkay onClick={closeModal} />;
}

function DeleteButton(): React.JSX.Element {
  return <ButtonDelete />;
}

FormModal.Header = Header;
FormModal.Content = Content;
FormModal.Footer = Footer;
FormModal.CloseButton = CloseButton;
FormModal.CancelButton = CancelButton;
FormModal.OkayButton = OkayButton;
FormModal.DeleteButton = DeleteButton;

export default FormModal;
