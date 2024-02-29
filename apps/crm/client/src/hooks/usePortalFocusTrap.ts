import { useEffect } from 'react';

type TParam1 = boolean;

function usePortalFocusTrap(portalActive: TParam1) {
  useEffect(() => {
    if (portalActive) {
      document.querySelector('div#root')?.setAttribute('inert', 'true');
    }

    return () => document.querySelector('div#root')?.removeAttribute('inert');
  }, [portalActive]);
}

export default usePortalFocusTrap;
