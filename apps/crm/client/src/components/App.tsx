import { RouterProvider } from 'react-aria-components';
import { Outlet, Route, Routes, Navigate, useNavigate, NavigateOptions } from 'react-router-dom';
import { Aside } from '#Features/sidebar/Aside';
import Header from '#Features/header/Header';
import { LayoutDefault } from '#Layouts/index';
import { Authenticate } from '#Modules/index';
import {
  PageForgotPassword,
  PageLogin,
  PageQuoteRead,
  PageQuoteCreate,
  PageQuoteUpdate,
  PageQuotes,
  PageRegister,
  PageUpdatePassword,
  PageCompanies,
  PageCompaniesCreate,
  PageContacts,
  PageContactsCreate,
  PageAuditLog,
  PageAuditLogDetails,
  PageSettings,
  PageQuoteDelete,
  PageCompaniesDelete,
  PageContactsDelete,
  PageCompaniesRead,
  PageContactsRead,
  PageKanban,
  PagePipline,
  PagePiplineStageCreate,
  PagePiplineDealCreate,
  PagePiplineStageUpdate,
  PagePiplineStageDelete,
  PagePiplineDealsDelete,
  PagePiplineDealDelete,
} from '#Pages/index';
import {
  RouteDashboard,
  RouteCalendar,
  RouteContacts,
  RouteScrumboard,
  RouteKanban,
  RoutePipeline,
  RouteCompanies,
  RouteQuotes,
  RouteAdministration,
  RouteSettings,
  RouteAuditLog,
} from '#Routes/index';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function App(): JSX.Element {
  // NOTE:  RouterProvider: Integrates React-Aria-Components into React-Router
  const navigate = useNavigate();

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
          <Route index element={<RouteDashboard />} />
          <Route path="calendar" element={<RouteCalendar />} />
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
          <Route index element={<RouteDashboard />} />
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
