import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

import AriaAnnouncement from '@Components/AriaAnnouncement';
import Header from '@Features/header/Header';
import { Aside } from '@Features/sidebar/Aside';
import DefaultLayout from '@Layouts/DefaultLayout';
import { useReduxSelector } from '@Redux/hooks';
import { selectorAriaEventsGlobal } from '@Redux/reducers/uiSlice';

function RootLayout(): React.JSX.Element {
  const uiEvent = useReduxSelector(selectorAriaEventsGlobal);
  const nextUiEvent = uiEvent[0];

  return (
    <>
      <AriaAnnouncement scope="global" uiEvent={nextUiEvent} />
      <DefaultLayout aside={<Aside />} header={<Header />}>
        <Outlet />
      </DefaultLayout>
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRoute({ component: RootLayout });
