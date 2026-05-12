import { createFileRoute } from '@tanstack/react-router';

import LoginPage from '@Pages/login/LoginPage';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});
