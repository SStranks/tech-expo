import { RouterProvider } from 'react-aria-components';
import { Navigate, NavigateOptions, Outlet, Route, Routes, useNavigate } from 'react-router-dom';

import Header from '#Features/header/Header';
import { Aside } from '#Features/sidebar/Aside';
import { LayoutDefault } from '#Layouts/index';
import { Authenticate } from '#Modules/index';
import {
  PageAuditLog,
  PageAuditLogDetails,
  PageCalendar,
  PageCompanies,
  PageCompaniesCreate,
  PageCompaniesDelete,
  PageCompaniesRead,
  PageContacts,
  PageContactsCreate,
  PageContactsDelete,
  PageContactsRead,
  PageForgotPassword,
  PageKanban,
  PageLogin,
  PagePipline,
  PagePiplineDealCreate,
  PagePiplineDealDelete,
  PagePiplineDealsDelete,
  PagePiplineDealUpdate,
  PagePiplineStageCreate,
  PagePiplineStageDelete,
  PagePiplineStageUpdate,
  PageQuoteCreate,
  PageQuoteDelete,
  PageQuoteRead,
  PageQuotes,
  PageQuoteUpdate,
  PageRegister,
  PageSettings,
  PageUpdatePassword,
} from '#Pages/index';
import {
  RouteAdministration,
  RouteAuditLog,
  RouteCalendar,
  RouteCompanies,
  RouteContacts,
  RouteDashboard,
  RouteKanban,
  RoutePipeline,
  RouteQuotes,
  RouteScrumboard,
  RouteSettings,
} from '#Routes/index';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function App(): JSX.Element {
  // NOTE:  RouterProvider: Integrates React-Aria-Components into React-Router
  const navigate = useNavigate();
  console.log('APP');

  return (
    <RouterProvider navigate={navigate}>
      <Routes>
        <Route
          element={
            <Authenticate fallback={<Navigate to={'/login'} />}>
              <LayoutDefault aside={<Aside />} header={<Header />}>
                <Outlet />
              </LayoutDefault>
            </Authenticate>
          }>
          <Route index path="/" element={<RouteDashboard />} />
          <Route element={<RouteCalendar />}>
            <Route path="calendar" element={<PageCalendar />} />
          </Route>
          <Route path="scrumboard" element={<RouteScrumboard />} />
          <Route path="kanban" element={<RouteKanban />}>
            <Route path="" element={<PageKanban />}>
              {/* <Route path="create" element={<PageCompaniesCreate />} />
              <Route path="delete/:id" element={<PageCompaniesDelete />} /> */}
            </Route>
          </Route>
          <Route element={<RoutePipeline />}>
            <Route path="pipeline" element={<PagePipline />}>
              <Route path="deal/create" element={<PagePiplineDealCreate />} />
              <Route path="deal/update/:id" element={<PagePiplineDealUpdate />} />
              <Route path="deal/delete/:id" element={<PagePiplineDealDelete />} />
              <Route path="deals/delete/:id" element={<PagePiplineDealsDelete />} />
              <Route path="stage/create" element={<PagePiplineStageCreate />} />
              <Route path="stage/update/:id" element={<PagePiplineStageUpdate />} />
              <Route path="stage/delete/:id" element={<PagePiplineStageDelete />} />
            </Route>
          </Route>
          <Route path="companies" element={<RouteCompanies />}>
            <Route path="" element={<PageCompanies />}>
              <Route path="create" element={<PageCompaniesCreate />} />
              <Route path="delete/:id" element={<PageCompaniesDelete />} />
            </Route>
            <Route path="read/:id" element={<PageCompaniesRead />} />
          </Route>
          <Route path="contacts" element={<RouteContacts />}>
            <Route path="" element={<PageContacts />}>
              <Route path="create" element={<PageContactsCreate />} />
              <Route path="delete/:id" element={<PageContactsDelete />} />
            </Route>
            <Route path="read/:id" element={<PageContactsRead />} />
          </Route>
          <Route path="quotes" element={<RouteQuotes />}>
            <Route path="" element={<PageQuotes />}>
              <Route path="create" element={<PageQuoteCreate />} />
              <Route path="update/:id" element={<PageQuoteUpdate />} />
              <Route path="delete/:id" element={<PageQuoteDelete />} />
            </Route>
            <Route path="read/:id" element={<PageQuoteRead />} />
          </Route>
          <Route path="administration" element={<RouteAdministration />} />
          <Route path="settings" element={<RouteSettings />}>
            <Route path="" element={<PageSettings />} />
          </Route>
          <Route path="auditlog" element={<RouteAuditLog />}>
            <Route path="" element={<PageAuditLog />}>
              <Route path="details" element={<PageAuditLogDetails />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route
          element={
            <Authenticate fallback={<Outlet />}>
              <Navigate to="/" />
            </Authenticate>
          }>
          <Route path="/login" element={<PageLogin />} />
          <Route path="/register" element={<PageRegister />} />
          <Route path="/forgot-password" element={<PageForgotPassword />} />
          <Route path="/update-password" element={<PageUpdatePassword />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </RouterProvider>
  );
}

export default App;
