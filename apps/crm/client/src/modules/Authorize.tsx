import type { UserRoles } from '@apps/crm-shared';
import type { PropsWithChildren } from 'react';

import { Navigate, useLocation } from '@tanstack/react-router';

import { useReduxSelector } from '@Redux/hooks';

type Props = {
  allowedRoles: UserRoles[];
};

function Authorize({ allowedRoles, children = undefined }: PropsWithChildren<Props>): React.JSX.Element | undefined {
  const auth = useReduxSelector((store) => store.auth);
  const location = useLocation();

  const isUserAuthorized = auth.user?.role && allowedRoles.includes(auth.user.role);

  return isUserAuthorized ? <>{children}</> : <Navigate to="/login" search={{ redirect: location.href }} replace />;
}

export default Authorize;
