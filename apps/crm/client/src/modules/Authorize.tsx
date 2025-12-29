import type { PropsWithChildren } from 'react';

import { Navigate, useLocation } from 'react-router-dom';

import { useReduxSelector } from '@Redux/hooks';
import { UserRoles } from '@Shared/src/types/api/auth';

type Props = {
  allowedRoles: UserRoles[];
};

function Authorize({ allowedRoles, children = undefined }: PropsWithChildren<Props>): React.JSX.Element | undefined {
  const auth = useReduxSelector((store) => store.auth);
  const location = useLocation();

  const isUserAuthorized = auth.user?.role && allowedRoles.includes(auth.user.role);

  return isUserAuthorized ? <>{children}</> : <Navigate to="/forbidden" state={{ from: location }} replace />;
}

export default Authorize;
