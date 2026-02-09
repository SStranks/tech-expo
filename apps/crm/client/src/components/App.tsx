import type { NavigateOptions } from 'react-router-dom';

import type { AuthRedirectState } from '@Types/navigation';

import { RouterProvider } from 'react-aria-components';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Header from '@Features/header/Header';
import { Aside } from '@Features/sidebar/Aside';
import DefaultLayout from '@Layouts/DefaultLayout';
import Authenticate from '@Modules/Authenticate';
import AuditLogDetailsPage from '@Pages/audit-log/AuditLogDetailsPage';
import AuditLogPage from '@Pages/audit-log/AuditLogPage';
import CalendarPage from '@Pages/calendar/CalendarPage';
import CompaniesCreatePage from '@Pages/companies/CompaniesCreatePage';
import CompaniesDeletePage from '@Pages/companies/CompaniesDeletePage';
import CompaniesPage from '@Pages/companies/CompaniesPage';
import CompaniesReadPage from '@Pages/companies/CompaniesReadPage';
import ContactsCreatePage from '@Pages/contacts/ContactsCreatePage';
import ContactsDeletePage from '@Pages/contacts/ContactsDeletePage';
import ContactsPage from '@Pages/contacts/ContactsPage';
import ContactsReadPage from '@Pages/contacts/ContactsReadPage';
import DashboardPage from '@Pages/dashboard/DashboardPage';
import ForgotPasswordPage from '@Pages/forgot-password/ForgotPasswordPage';
import KanbanPage from '@Pages/kanban/KanbanPage';
import LoginPage from '@Pages/login/LoginPage';
import PipelineDealCreatePage from '@Pages/pipeline/PipelineDealCreatePage';
import PiplineDealDeletePage from '@Pages/pipeline/PipelineDealDeletePage';
import PiplineDealsDeletePage from '@Pages/pipeline/PipelineDealsDeletePage';
import PipelineDealUpdatePage from '@Pages/pipeline/PipelineDealUpdatePage';
import PipelinePage from '@Pages/pipeline/PipelinePage';
import PipelineStageCreatePage from '@Pages/pipeline/PipelineStageCreatePage';
import PiplineStageDeletePage from '@Pages/pipeline/PipelineStageDeletePage';
import PipelineStageUpdatePage from '@Pages/pipeline/PipelineStageUpdatePage';
import QuoteCreatePage from '@Pages/quotes/QuoteCreatePage';
import QuoteDeletePage from '@Pages/quotes/QuoteDeletePage';
import QuoteReadPage from '@Pages/quotes/QuoteReadPage';
import QuotesPage from '@Pages/quotes/QuotesPage';
import QuoteUpdatePage from '@Pages/quotes/QuoteUpdatePage';
import RegisterPage from '@Pages/register/RegisterPage';
import SettingsPage from '@Pages/settings/SettingsPage';
import UpdatePasswordPage from '@Pages/update-password/UpdatePasswordPage';
import { useReduxSelector } from '@Redux/hooks';
import { selectorAriaEventsGlobal } from '@Redux/reducers/uiSlice';
import AdministrationRoute from '@Routes/administration/AdministrationRoute';
import AuditLogRoute from '@Routes/audit-log/AuditLogRoute';
import CalendarRoute from '@Routes/calendar/CalendarRoute';
import CompaniesRoute from '@Routes/companies/CompaniesRoute';
import ContactsRoute from '@Routes/contacts/ContactsRoute';
import DashboardRoute from '@Routes/dashboard/DashboardRoute';
import KanbanRoute from '@Routes/kanban/KanbanRoute';
import PipelineRoute from '@Routes/pipeline/PipelineRoute';
import QuotesRoute from '@Routes/quotes/QuotesRoute';
import ScrumboardRoute from '@Routes/scrumboard/ScrumboardRoute';
import SettingsRoute from '@Routes/settings/SettingsRoute';

import AriaAnnouncement from './AriaAnnouncement';

declare module 'react-aria-components' {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

function App(): React.JSX.Element {
  // NOTE:  RouterProvider: Integrates React-Aria-Components into React-Router
  const navigate = useNavigate();
  const { hash, pathname, search } = useLocation();
  const uiEvent = useReduxSelector(selectorAriaEventsGlobal);
  const nextUiEvent = uiEvent[0];

  return (
    <RouterProvider navigate={(to) => void navigate(to)}>
      <AriaAnnouncement scope="global" uiEvent={nextUiEvent} />
      <Routes>
        <Route
          element={
            <Authenticate
              fallback={
                <Navigate
                  to="/login"
                  state={{ from: { hash, pathname, search } } satisfies AuthRedirectState}
                  replace
                />
              }>
              <DefaultLayout aside={<Aside />} header={<Header />}>
                <Outlet />
              </DefaultLayout>
            </Authenticate>
          }>
          <Route path="/" element={<DashboardRoute />}>
            <Route index element={<DashboardPage />} />
          </Route>
          <Route element={<CalendarRoute />}>
            <Route path="calendar" element={<CalendarPage />} />
          </Route>
          <Route path="scrumboard" element={<ScrumboardRoute />} />
          <Route path="kanban" element={<KanbanRoute />}>
            <Route path="" element={<KanbanPage />}>
              {/* <Route path="create" element={<PageCompaniesCreate />} />
              <Route path="delete/:id" element={<PageCompaniesDelete />} /> */}
            </Route>
          </Route>
          <Route element={<PipelineRoute />}>
            <Route path="pipeline" element={<PipelinePage />}>
              <Route path="deal/create/:stageId" element={<PipelineDealCreatePage />} />
              <Route path="deal/update/:stageId/:dealId" element={<PipelineDealUpdatePage />} />
              <Route path="deal/delete/:stageId/:dealId" element={<PiplineDealDeletePage />} />
              <Route path="deals/delete/:stageId/:dealId" element={<PiplineDealsDeletePage />} />
              <Route path="stage/create" element={<PipelineStageCreatePage />} />
              <Route path="stage/update/:stageid" element={<PipelineStageUpdatePage />} />
              <Route path="stage/delete/:stageid" element={<PiplineStageDeletePage />} />
            </Route>
          </Route>
          <Route path="companies" element={<CompaniesRoute />}>
            <Route path="" element={<CompaniesPage />}>
              <Route path="create" element={<CompaniesCreatePage />} />
              <Route path="delete/:id" element={<CompaniesDeletePage />} />
            </Route>
            <Route path="read/:id" element={<CompaniesReadPage />} />
          </Route>
          <Route path="contacts" element={<ContactsRoute />}>
            <Route path="" element={<ContactsPage />}>
              <Route path="create" element={<ContactsCreatePage />} />
              <Route path="delete/:id" element={<ContactsDeletePage />} />
            </Route>
            <Route path="read/:id" element={<ContactsReadPage />} />
          </Route>
          <Route path="quotes" element={<QuotesRoute />}>
            <Route path="" element={<QuotesPage />}>
              <Route path="create" element={<QuoteCreatePage />} />
              <Route path="update/:quoteId" element={<QuoteUpdatePage />} />
              <Route path="delete/:quoteId" element={<QuoteDeletePage />} />
            </Route>
            <Route path="read/:id" element={<QuoteReadPage />} />
          </Route>
          <Route path="administration" element={<AdministrationRoute />} />
          <Route path="settings" element={<SettingsRoute />}>
            <Route path="" element={<SettingsPage />} />
          </Route>
          <Route path="auditlog" element={<AuditLogRoute />}>
            <Route path="" element={<AuditLogPage />}>
              <Route path="details" element={<AuditLogDetailsPage />} />
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </RouterProvider>
  );
}

export default App;
