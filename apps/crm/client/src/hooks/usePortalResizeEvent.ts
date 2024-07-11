import { useEffect } from 'react';

// Used in conjunction with a portal that has active/inactive boolean state
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
