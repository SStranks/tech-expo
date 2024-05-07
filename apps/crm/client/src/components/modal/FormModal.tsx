import { PropsWithChildren, createContext, useContext, useMemo, useRef } from 'react';
import { ButtonCancel, ButtonClose } from '#Components/buttons';
import usePortalClose from '#Hooks/usePortalClose';
import styles from './_FormModal.module.scss';

interface IFormModalContext {
  setPortalActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const FormModalContext = createContext({} as IFormModalContext);

interface IProps {
  portalActive: boolean;
  setPortalActive: React.Dispatch<React.SetStateAction<boolean>>;
}

function FormModal({
  children = undefined,
  portalActive,
  setPortalActive: setPortalActiveProp,
}: PropsWithChildren<IProps>): JSX.Element {
  const modalContentRef = useRef<HTMLDivElement>(null);
  usePortalClose(portalActive, setPortalActiveProp, modalContentRef, null);

  const setPortalActive = useMemo(() => setPortalActiveProp, [setPortalActiveProp]);

  return (
    <div className={styles.modalContainer}>
      <div className={styles.formModal} ref={modalContentRef}>
        <FormModalContext.Provider value={{ setPortalActive }}>{children}</FormModalContext.Provider>
      </div>
    </div>
  );
}

function Header({ title }: { title: string }): JSX.Element {
  return (
    <div className={styles.header}>
      <h4>{title}</h4>
      <FormModal.CloseButton />
    </div>
  );
}

function Content({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.content}>{children}</div>;
}

function Footer({ children }: PropsWithChildren): JSX.Element {
  return <div className={styles.footer}>{children}</div>;
}

function CloseButton(): JSX.Element {
  const { setPortalActive } = useContext(FormModalContext);

  const closeModal = () => {
    setPortalActive(false);
  };

  return <ButtonClose onClick={closeModal} />;
}

function CancelButton(): JSX.Element {
  const { setPortalActive } = useContext(FormModalContext);

  const closeModal = () => {
    setPortalActive(false);
  };
  return <ButtonCancel onClick={closeModal} />;
}

FormModal.Header = Header;
FormModal.Content = Content;
FormModal.Footer = Footer;
FormModal.CloseButton = CloseButton;
FormModal.CancelButton = CancelButton;

export default FormModal;
