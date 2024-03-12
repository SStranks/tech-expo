import { Outlet, Route, Routes, Navigate } from 'react-router-dom';
import { Aside } from '#Features/sidebar/Aside';
import Header from '#Features/header/Header';
import DefaultLayout from '#Layouts/DefaultLayout';
import { Authenticate } from '#Modules/index';
import { ForgotPasswordPage, LoginPage, RegisterPage, UpdatePasswordPage } from '#Pages/index';
import { DashboardRoute, CalendarRoute } from '#Routes/index';

// TEMP DEV: . Force darkmode
const body = document.querySelector('body');
body?.classList.add('dark-theme');

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route
          element={
            <Authenticate fallback={<Navigate to={'/login'} />}>
              <DefaultLayout aside={<Aside />} header={<Header />}>
                <Outlet />
              </DefaultLayout>
            </Authenticate>
          }>
          <Route index element={<DashboardRoute />} />
          <Route path="calendar" element={<CalendarRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route
          element={
            <Authenticate fallback={<Outlet />}>
              <Navigate to="/" />
            </Authenticate>
          }>
          <Route index element={<DashboardRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
