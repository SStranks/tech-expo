import { useEffect } from 'react';

type TParam1 = boolean;
type TParam2 = React.Dispatch<React.SetStateAction<boolean>>;
type TParam3 = React.RefObject<HTMLDivElement>;
type TParam4 = React.RefObject<HTMLButtonElement>;

// Closes portal/modal content; when ESC key or click outside of modal content
function usePortalClose(
  portalActive: TParam1,
  setPortalActive: TParam2,
  portalContentRef: TParam3,
  openPortalContentBtnRef: TParam4
): void {
  return useEffect(() => {
    const closePortal = (e: KeyboardEvent | MouseEvent) => {
      if (portalContentRef === null || portalContentRef.current === null) return;
      if (openPortalContentBtnRef === null || openPortalContentBtnRef.current === null) return;

      // Close portal on Escape keydown
      if (portalActive && e instanceof KeyboardEvent && (e.key === 'Esc' || e.key === 'Escape')) {
        setPortalActive(false);
      }

      // Close portal on click outside of portal content - ignore button that openned portal.
      if (
        portalActive &&
        e instanceof MouseEvent &&
        !openPortalContentBtnRef.current.contains(e.target as HTMLButtonElement) &&
        !portalContentRef.current.contains(e.target as HTMLElement)
      )
        setPortalActive(false);
    };

    document.addEventListener('keydown', closePortal);
    document.addEventListener('click', closePortal);
    return () => {
      document.removeEventListener('keydown', closePortal);
      document.removeEventListener('click', closePortal);
    };
  });
}

export default usePortalClose;

// Close notifications window on Escape keydown or click outside modal content
//  useEffect(() => {
//   const closePortal = (e: KeyboardEvent | MouseEvent) => {
//     if (portalActive && e instanceof KeyboardEvent && (e.key === 'Esc' || e.key === 'Escape')) {
//       setPortalActive(false);
//     }
//     if (!portalContentRef.current) return;
//     console.log(e.target);
//     if (portalActive && e instanceof MouseEvent && !portalContentRef.current.contains(e.target as HTMLElement))
//       setPortalActive(false);
//   };
