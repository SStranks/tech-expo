import type { PropsWithChildren } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useReduxSelector } from '@Redux/hooks';

interface IProps {
  allowedRoles: string[];
}

function Authorize({ allowedRoles, children = undefined }: PropsWithChildren<IProps>): JSX.Element | undefined {
  const auth = useReduxSelector((store) => store.auth);
  const location = useLocation();

  return auth.roles?.find((role) => allowedRoles?.includes(role)) ? (
    <>{children}</>
  ) : (
    <Navigate to="/forbidden" state={{ from: location }} replace />
  );
}

export default Authorize;
