import type { PropsWithChildren } from 'react';

// import { Navigate } from 'react-router-dom';
import { useReduxSelector } from '@Redux/hooks';

interface IProps {
  fallback: JSX.Element;
}

function Authenticate({ children = undefined, fallback }: PropsWithChildren<IProps>): JSX.Element | undefined {
  const auth = useReduxSelector((store) => store.auth);
  // const location = useLocation();

  // from tutorial, not sure if necessary
  // return auth.isAuthenticated ? <>{children}</> : <Navigate to={fallbackPath} state={{ from: location }} replace />;
  return auth.isAuthenticated ? <>{children}</> : fallback;
}

export default Authenticate;
