import { useEffect } from 'react';

type TParam1 = boolean;
type TParam2 = React.Dispatch<React.SetStateAction<boolean>>;
type TParam3 = React.RefObject<HTMLDivElement | null>;
type TParam4 = React.RefObject<HTMLButtonElement | null>;

// Closes portal/modal content; when ESC key or click outside of modal content
function usePortalClose(
  portalActive: TParam1,
  setPortalActive: TParam2,
  portalContentRef: TParam3,
  openPortalContentBtnRef?: TParam4
): void {
  return useEffect(() => {
    const closePortal = (e: KeyboardEvent | MouseEvent) => {
      if (portalContentRef === null || portalContentRef.current === null) return;

      /*
        Abort if an input element or textarea is in focus elsewhere in the document; used in conjunction with
        'mousedown' to allow input to be unfocused without triggering eventhandler.
      */
      if (document.activeElement instanceof HTMLInputElement || document.activeElement instanceof HTMLTextAreaElement)
        return;

      // Close portal on Escape keydown
      if (portalActive && e instanceof KeyboardEvent && (e.key === 'Esc' || e.key === 'Escape')) {
        setPortalActive(false);
      }

      // Close portal on click outside of portal content - ignore button that openned portal.
      if (portalActive && e instanceof MouseEvent) {
        if (openPortalContentBtnRef && openPortalContentBtnRef.current) {
          if (
            !openPortalContentBtnRef.current.contains(e.target as HTMLButtonElement) &&
            !portalContentRef.current.contains(e.target as HTMLElement)
          )
            setPortalActive(false);
        } else {
          if (!portalContentRef.current.contains(e.target as HTMLElement)) setPortalActive(false);
        }
      }

      // if (
      //   portalActive &&
      //   e instanceof MouseEvent &&
      //   !openPortalContentBtnRef.current.contains(e.target as HTMLButtonElement) &&
      //   !portalContentRef.current.contains(e.target as HTMLElement)
      // )
      //   setPortalActive(false);
    };

    document.addEventListener('keydown', closePortal);
    document.addEventListener('mousedown', closePortal);
    return () => {
      document.removeEventListener('keydown', closePortal);
      document.removeEventListener('mousedown', closePortal);
    };
  });
}

export default usePortalClose;
