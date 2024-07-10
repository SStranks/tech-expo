import { useEffect } from 'react';

function usePortalResizeEvent(menuPortalActive: boolean, eventListener: () => void) {
  useEffect(() => {
    addEventListener('resize', eventListener);

    if (!menuPortalActive) {
      removeEventListener('resize', eventListener);
    }
    return () => removeEventListener('resize', eventListener);
  }, [menuPortalActive, eventListener]);
}

export default usePortalResizeEvent;
