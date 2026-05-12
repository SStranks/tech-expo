import { createFileRoute } from '@tanstack/react-router';

import ForgotPasswordPage from '@Pages/forgot-password/ForgotPasswordPage';

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPasswordPage,
});
