import { PropsWithChildren } from 'react';

interface IProps {
  fallback: JSX.Element | undefined;
}

function Authenticate({ fallback, children = undefined }: PropsWithChildren<IProps>): JSX.Element | undefined {
  const loginToken = window.localStorage.getItem('CRM Login Token');

  return loginToken ? <>{children}</> : fallback;
}

export default Authenticate;
