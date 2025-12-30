import { useEffect } from 'react';

type Param1 = boolean;

function usePortalFocusTrap(portalActive: Param1) {
  useEffect(() => {
    if (portalActive) {
      document.querySelector('div#root')?.setAttribute('inert', 'true');
    }

    return () => document.querySelector('div#root')?.removeAttribute('inert');
  }, [portalActive]);
}

export default usePortalFocusTrap;
