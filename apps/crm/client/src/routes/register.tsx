import { createFileRoute } from '@tanstack/react-router';

import RegisterPage from '@Pages/register/RegisterPage';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});
