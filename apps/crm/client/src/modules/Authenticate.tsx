import type { PropsWithChildren } from 'react';

import { useReduxSelector } from '@Redux/hooks';

type Props = {
  fallback: React.JSX.Element;
};

function Authenticate({ children = undefined, fallback }: PropsWithChildren<Props>): React.JSX.Element | undefined {
  const auth = useReduxSelector((store) => store.auth);

  // const location = useLocation();

  // TODO: from tutorial, not sure if necessary
  // return auth.isAuthenticated ? <>{children}</> : <Navigate to={fallbackPath} state={{ from: location }} replace />;
  return auth.isAuthenticated ? <>{children}</> : fallback;
}

export default Authenticate;
